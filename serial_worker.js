console.assert('serial' in navigator);

let serialPort;

const sender = (() => {
	let isActivate = false;
	let timerId = 0;
	let midiEvents = [];
	let lastPortPrefix = -1;
	let tmpBuf = new Uint8Array(65536);
	let writer;

	function pushMidiEvents(bytes, timestamp, portPrefix) {
		console.assert(bytes instanceof Uint8Array && Number.isFinite(timestamp));
		midiEvents.push({bytes, timestamp, portPrefix});
	}

	function startLoop() {
		stopLoop();

		if (!serialPort?.writable) {
			console.error('Cannot begin the MIDI Out loop.');
			return;
		}

		timerId = setTimeout(mainLoop, 0);
		isActivate = true;

		lastPortPrefix = -1;
	}

	function stopLoop() {
		if (timerId !== 0) {
			clearTimeout(timerId);
			timerId = 0;
		}
		isActivate = false;
	}

	async function closeWriter() {
		if (writer) {
			await writer.abort().catch((e) => console.warn(e));	// Ignores error.
			writer.releaseLock();
		}
	}

	function mainLoop() {
		timerId = 0;

		if (!isActivate) {
			return;
		}

		if (!serialPort?.writable) {
			writer = null;
			return;
		}

		// If the event list is empty, exits this loop and triggers next loop.
		if (midiEvents.length === 0) {
			timerId = setTimeout(mainLoop, 0);
			return;
		}

		try {
			(async () => {
				// Makes a writer if necessary.
				if (!writer) {
					writer = serialPort.writable.getWriter();
				}
				console.assert(writer);

				// Marks events to be processed and ignored.
				midiEvents.sort((a, b) => a.timestamp - b.timestamp);
				const now = performance.now();
				midiEvents.forEach((event) => {
					event.isPast =    (event.timestamp <= now);
					event.isIgnored = (event.timestamp <= now - 10 * 1000);
				});

				// Makes a buffer to be sent.
				let byteLength = 0;
				for (const event of midiEvents.filter((event) => event.isPast && !event.isIgnored)) {
					// If the buffer is short to store all the event, breaks this loop and turns it over to the next time. (rare case)
					if (byteLength + event.bytes.byteLength > tmpBuf.byteLength) {
						console.warn(`Internal buffer size (${tmpBuf.byteLength}) is too small. Default buffer size should be more larger.`);

						// If the buffer is short to store this event, extends the buffer. (very rare case)
						if (event.bytes.byteLength > tmpBuf.byteLength) {
							const newBuf = new Uint8Array(event.bytes.byteLength);
							newBuf.set(tmpBuf, 0);
							tmpBuf = newBuf;
						}
						break;
					}

					// Adds "F5h pp" event to switch the port for sending.
					if (event.portPrefix !== lastPortPrefix) {
						tmpBuf.set([0xf5, event.portPrefix], byteLength);
						byteLength += 2;
					}

					// Copies the midi message bytes to the buffer.
					tmpBuf.set(event.bytes, byteLength);
					byteLength += event.bytes.byteLength;

					event.isSent = true;
					lastPortPrefix = event.portPrefix;
				}

				// Writes the data to serial port.
				await writer.write(new Uint8Array(tmpBuf.buffer, 0, byteLength));

				// Rebuilds the event list.
				midiEvents = midiEvents.filter((event) => !event.isSent && !event.isIgnored);

				// Triggers next loop.
				timerId = setTimeout(mainLoop, 0);
			})();

		} catch (error) {
			console.error(error);

			writer = null;
			notifySerialUnavailable();
		}
	}

	return {
		pushMidiEvents,
		startLoop,
		stopLoop,
		closeWriter,
	};
})();

const portSettings = (() => {
	let serialPortInfo;
	let serialOptions;

	function setPortInfo(portInfo, options) {
		serialPortInfo = portInfo;
		serialOptions  = options;
	}

	function isChosenPort(port) {
		const info = port.getInfo();

		// Note: There seems not to be any certain way to identify the serial port chosen by user.
		return (info.usbProductId === serialPortInfo?.usbProductId && info.usbVendorId === serialPortInfo?.usbVendorId);
	}

	return {
		getCurrentSettings: () => serialOptions,
		setPortInfo,
		isChosenPort,
	};
})();

navigator.serial.addEventListener('connect', async (e) => {
	console.assert(!serialPort);

	// If the connected port is chosen by requestPort(), retries to connect automatically.
	if (portSettings.isChosenPort(e.target)) {
		serialPort = e.target;
		await openPort();
	}
});

navigator.serial.addEventListener('disconnect', async (e) => {
	console.assert(serialPort);

	// if the disconnected port is the current port chosen by requestPort(), notifies disconnection.
	if (e.target === serialPort) {
		notifySerialUnavailable();
		await closePort().catch((e) => console.warn(e)).finally(() => {	// Ignores error.
			serialPort = null;	// serialPort is referred in closePort() so the variable shall be set after closePort() is resolved.
		});
	}
});

self.addEventListener('message', async (e) => {
	const args = e.data;

	switch (args.kind) {
	case 'prepareForSerialPort':
		await prepareForSerialPort(args.serialPortInfo, args.serialOptions);
		break;

	case 'MIDIOutput_send':
		sender.pushMidiEvents(args.bytes, args.timestamp, args.portPrefix);
		break;

	default:
		console.assert(false);
		break;
	}
});

async function prepareForSerialPort(portInfo, options) {
	// Stores the port information.
	portSettings.setPortInfo(portInfo, options);

	// Identifies the requested port.
	const ports = await navigator.serial.getPorts();
	const chosenPorts = ports.filter((port) => portSettings.isChosenPort(port));
	console.assert(chosenPorts.length > 0);
	serialPort = chosenPorts[0];
	if (chosenPorts.length !== 1) {
		console.warn('Cannot identify the chosen port. Chooses the first one.');
	}

	// Closes the port once and then reopens it.
	await closePort();
	await openPort();
}

async function openPort() {
	await serialPort.open(portSettings.getCurrentSettings());
	sender.startLoop();
	notifySerialAvailable();
}

async function closePort() {
	notifySerialUnavailable();
	await sender.closeWriter().catch((e) => console.warn(e));	// Ignores error.
	if (serialPort) {
		await serialPort.close().catch(() => {/*EMPTY*/});	// Ignores error.
	}
}

function notifySerialAvailable() {
	self.postMessage({kind: 'notifySerialAvailable'});
}

function notifySerialUnavailable() {
	self.postMessage({kind: 'notifySerialUnavailable'});
}
