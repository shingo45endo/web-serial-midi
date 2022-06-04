import {MidiEventParser, isValidMessageBytes} from './midi_event_parser.js';
import {analyzeIdentityReply} from './midi_device_info.js';

const worker = ('serial' in navigator) ? new Worker(import.meta.url.replace(/\/[^/]*$/u, '/serial_worker.js'), {type: 'module'}) : null;

class MIDIPort extends EventTarget {
	constructor(properties) {
		super();

		this._portPrefix = properties?.portPrefix ?? -1;

		const type = (this instanceof MIDIOutput) ? 'out' : 'in';
		this.id = `serial-midi-${type}${(this._portPrefix >= 0) ? `-${this._portPrefix}` : ''}`;
		this.name = properties?.name ?? this.id;
		this.manufacturer = 'web-serial-midi';
		this.version = '0.1.0';
		this.state = 'disconnected';
		this.connection = 'closed';
	}

	async open() {
		try {
			if (this.connection === 'opened') {
				return this;
			}
			if (this.connection === 'pending' && this.state === 'disconnected') {
				return this;
			}
			if (this.state === 'disconnected') {
				if (this.connection !== 'pending') {
					console.assert(this.connection === 'closed');
					this.connection = 'pending';
					this._notifyStateChange();
				}

				return this;
			}

			if (!this._midiAccess) {
				throw new Error();
			}

			this.connection = 'opened';
			this._notifyStateChange();

			return this;

		} catch (error) {
			console.log(error);
			throw new DOMException('Failed to open MIDIPort', 'InvalidAccessError');
		}
	}

	async close() {
		try {
			if (this.connection === 'closed') {
				return this;
			}
			if (this.type === 'output' && this.state === 'disconnected') {
				this.clear();
			}

			this.connection = 'closed';
			this._notifyStateChange();

			return this;

		} catch (error) {
			console.log(error);
			throw new DOMException('Failed to close MIDIPort', 'InvalidStateError');
		}
	}

	async _connect() {
		console.assert(this._midiAccess);
		if (this.state === 'connected') {
			return;
		}

		this.state = 'connected';

		if (this.connection === 'pending' || this.connection === 'closed') {	// Note: At the current implementation, 'closed' ports will be opened automatically when connected.
			// If the port is 'pending', resumes the port. If failed to open it, closes it.
			await this.open().catch(async () => {
				await this.close().catch(() => {/*EMPTY*/});
			});
		} else {
			// Dispatch statechange for 'disconnected' to 'connected'.
			console.assert(this.connection === 'closed');
			this._notifyStateChange();
		}
	}

	async _disconnect() {
		if (this.state === 'disconnected') {
			return;
		}

		this.state = 'disconnected';

		if (this.connection === 'opened') {
			this.connection = 'pending';
			this._notifyStateChange();
		}
	}

	_notifyStateChange() {
		const event = new Event('statechange');
		event.port = this;
		this.dispatchEvent(event);

		if (this._midiAccess) {
			this._midiAccess.dispatchEvent(event);
		}
	}
}

class MIDIOutput extends MIDIPort {
	constructor(properties) {
		super(properties);

		this.type = 'output';
	}

	send(data, timestamp) {
		if (this.connection === 'closed') {
			// TODO: Open the port automatically.
			return;
		}

		if (this.state === 'disconnected') {
			throw new DOMException('Failed to send data', 'InvalidStateError');
		}

		if (this.connection === 'pending') {
			// TODO: Needs to store MIDI messages to be sent in the internal buffer?
			return;
		}

		// Checks the payload of MIDI messages.
		// TODO: Treats F5 event as undefined system common message. (Not a port prefix for serial MIDI)
		if (!isValidMessageBytes(data)) {
			throw new TypeError('Invalid data');
		}

		// Prepare the arguments.
		if (!(data instanceof Uint8Array)) {
			console.assert(Array.isArray(data));
			data = new Uint8Array(data);
		}
		if (!timestamp) {
			timestamp = performance.now();
		}

		// Sends the chunk of MIDI messages to serial.
		worker.postMessage({kind: 'MIDIOutput_send', bytes: data, timestamp, portPrefix: this._portPrefix});
	}

	clear() {
		// TODO: Implement
	}
}

class MIDIInput extends MIDIPort {
	constructor(properties) {
		super(properties);

		this.type = 'input';
	}

	_notifyMidiMessage(bytes, timestamp) {
		if (this.state === 'connected' && this.connection === 'opened') {
			const event = new Event('midimessage');
			event.data = bytes;
			event.receivedTime = timestamp ?? performance.now();
			this.dispatchEvent(event);
		}
	}
}

/* eslint-disable no-underscore-dangle */

class MIDIAccess extends EventTarget {
	constructor(options) {
		super();

		this.inputs  = new Map();
		this.outputs = new Map();
		this.sysexEnabled = options.sysex ?? false;

		this._allPorts = new Map();

		this._parser = new MidiEventParser();
		this._lastPortPrefix = -1;
	}

	_addPort(port) {
		console.assert(port instanceof MIDIPort);
		const {id, type} = port;

		// Adds the port.
		if (this._allPorts.has(id)) {
			this._removePort(port);
		}
		this._allPorts.set(id, port);

		// Exposes the added port as inputs/outputs.
		switch (type) {
		case 'input':
			this.inputs.set(id, port);
			this._lastPortPrefix = -1;
			break;
		case 'output':
			this.outputs.set(id, port);
			break;
		default:
			console.assert(false);
			break;
		}

		// Adds the reference to MIDI Access.
		port._midiAccess = this;
	}

	_removePort(port) {
		console.assert(port instanceof MIDIPort);
		const {id, type} = port;

		// Removes the port.
		this._allPorts.delete(id);

		// Hides the removed port from inputs/outputs.
		switch (type) {
		case 'input':
			this.inputs.delete(id);
			this._lastPortPrefix = -1;
			break;
		case 'output':
			this.outputs.delete(id);
			break;
		default:
			console.assert(false);
			break;
		}

		// Removes the reference to MIDI Access.
		port._midiAccess = null;
	}

	async _connectAllPorts() {
		await Promise.allSettled([...this._allPorts.values()].filter((port) => port._midiAccess).map((port) => port._connect()));
		[...this._allPorts.values()].filter((port) => !port._midiAccess).forEach((port) => this._removePort(port));
	}

	async _disconnectAllPorts() {
		await Promise.allSettled([...this._allPorts.values()].filter((port) => port._midiAccess).map((port) => port._disconnect()));
		[...this._allPorts.values()].filter((port) => !port._midiAccess).forEach((port) => this._removePort(port));
	}

	_inputBytes(bytes) {
		// Parses input data from serial.
		this._parser.pushBytes(bytes);
		const messages = this._parser.popEvents();

		if (messages.length > 0) {
			for (const bytes of messages) {
				// Handles F5 event.
				if (bytes[0] === 0xf5) {
					console.assert(bytes.length === 2);
					this._lastPortPrefix = bytes[1];
					continue;
				}

				// Dispatches a MIDI input event to input ports.
				if (this.inputs.size === 1) {
					[...this.inputs.values()][0]._notifyMidiMessage(bytes);
				} else {
					for (const port of [...this.inputs.values()].filter((port) => port._portPrefix === this._lastPortPrefix)) {
						port._notifyMidiMessage(bytes);
					}
				}
			}
		}
	}
}

let midiAccess;
let isSerialAvailable = false;

export async function prepareForSerialMidi(settings = {}) {
	if (!worker) {
		throw new Error('Web Serial API not supported');
	}

	// Extracts options for Web Serial API.
	const serialOptions = Object.keys(settings).filter((key) => ['baudRate', 'flowControl', 'bufferSize'].includes(key)).reduce((p, c) => {
		p[c] = settings[c];
		return p;
	}, {baudRate: 38400});

	// Chooses which serial port to be used.
	const serialPort = await navigator.serial.requestPort();

	// Makes the worker open the chosen serial port.
	worker.postMessage({kind: 'prepareForSerialPort', serialPortInfo: serialPort.getInfo(), serialOptions});
}

export async function requestMIDIAccess(options = {}) {
	if (!worker) {
		throw new DOMException('Web Serial API not supported', 'NotSupportedError');
	}

	if (midiAccess) {
		return midiAccess;
	}

	try {
		midiAccess = new MIDIAccess(options);

		// Waits for preparation of serial port.
		await new Promise((resolve) => {
			const timerId = setInterval(() => {
				if (isSerialAvailable) {
					clearInterval(timerId);
					resolve();
				}
			}, 100);
		});

		// Makes MIDI ports.
		worker.addEventListener('message', handleSerialReadData);
		const tmpParser = new MidiEventParser();
		const ports = await Promise.any([
			// Determines the number of each input/output port required by Device Inquiry. (or something like that)
			new Promise((resolve) => {
				// Sends SysExs to identify the device.
				const timestamp = performance.now();
				worker.postMessage({kind: 'MIDIOutput_send', bytes: new Uint8Array([
					0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7,	// Identity Request (Device ID: 7Fh)
					0xf0, 0x7e, 0x00, 0x06, 0x01, 0xf7,	// Identity Request (Device ID: 00h)	// Note: Some devices don't reply to "f0 7e 7f 06 01 f7".
					0xf0, 0x41, 0x10, 0x42, 0x11, 0x40, 0x30, 0x00, 0x00, 0x00, 0x20, 0x70, 0xf7,	// RQ1 for "GS System Information".
					0xf0, 0x43, 0x20, 0x4c, 0x01, 0x00, 0x00, 0xf7,	// Bulk dump request for "XG System Information".
				]), timestamp});

				// Makes MIDI ports from obtained port information.
				let ports;
				const timerId = setInterval(() => {
					const messages = tmpParser.popEvents();
					for (const bytes of messages) {
						if (bytes[0] !== 0xf0) {
							continue;
						}

						if (bytes[1] === 0x7e && bytes[3] === 0x06 && bytes[4] === 0x02) {
							// Gets device information from Identity Reply and makes MIDI ports from the information.
							const deviceInfo = analyzeIdentityReply(bytes);
							ports = makeMidiPorts(deviceInfo);	// Overwrites port information even if already exists.

						} else if (bytes[1] === 0x41 && bytes[3] === 0x42 && bytes[4] === 0x12 && bytes[5] === 0x40 && bytes[6] === 0x30 && bytes[7] === 0x00) {
							// Roland SC-88 and SC-88VL have 2 output ports but they don't support Device Inquiry. To identify them, checks the string of "GS System Information".
							const infoStr = String.fromCharCode(...bytes.slice(8, -2));
							if (infoStr.includes('SC-88')) {
								if (!ports) {	// If port information already exists by Identity Reply, keeps it. Otherwise, makes MIDI ports.
									ports = makeMidiPorts({deviceName: 'SC-88', outputPorts: 2});
								}
							}
						} else if (bytes[1] === 0x43 && bytes[3] === 0x4c && bytes[6] === 0x01 && bytes[7] === 0x00 && bytes[8] === 0x00) {
							// Yamaha MU80 has 2 output ports but it doesn't support Device Inquiry. To identify it, checks the string of "XG System Information".
							const infoStr = String.fromCharCode(...bytes.slice(9, -2));
							if (infoStr.includes('MU80')) {
								if (!ports) {	// If port information already exists by Identity Reply, keeps it. Otherwise, makes MIDI ports.
									ports = makeMidiPorts({deviceName: 'MU80', outputPorts: 2});
								}
							}
						}
					}

					// Terminates the loop.
					const pastMsec = performance.now() - timestamp;
					if (pastMsec > 1250) {
						clearInterval(timerId);
						resolve([]);
					} else if (pastMsec > 750) {
						if (ports) {
							clearInterval(timerId);
							resolve(ports);
						}
					}
				}, 100);
			}),
			// If cannot identify the device, adds default MIDI ports.
			new Promise((resolve) => {
				setTimeout(() => {
					resolve([
						new MIDIOutput({name: 'Serial MIDI Out'}),
						new MIDIInput({name: 'Serial MIDI In'}),
					]);
				}, 1000);
			}),
		]);
		worker.removeEventListener('message', handleSerialReadData);

		// Adds MIDI ports and connects them.
		for (const port of ports) {
			midiAccess._addPort(port);
		}
		await midiAccess._connectAllPorts();

		return midiAccess;

		function handleSerialReadData(e) {
			if (e?.data?.kind === 'notifySerialReadData') {
				tmpParser.pushBytes(e.data.bytes);
			}
		}

	} catch (error) {
		console.error(error);
		throw new DOMException('Failed to use Web Serial API', 'NotSupportedError');
	}
}

function makeMidiPorts(portInfo) {
	if (!portInfo) {
		console.assert(false);
		return null;
	}

	const ports = [];
	const namePrefix = (portInfo.deviceName) ? `${portInfo.deviceName} ` : '';
	for (let i = 0; i < 2; i++) {
		const [inOut, portPropName, MIDIPort] = [['Out', 'outputPorts', MIDIOutput], ['In', 'inputPorts', MIDIInput]][i];
		if (Array.isArray(portInfo[portPropName])) {
			for (const port of portInfo[portPropName]) {
				if ('portPrefix' in port && !isValidPortPrefix(port.portPrefix)) {
					console.assert(false);
					return null;
				}
				const portPrefix = port.portPrefix ?? -1;
				const name = (port.name) ? port.name : makePortName(inOut, portPrefix);
				ports.push(new MIDIPort({name, portPrefix}));
			}
		} else if (Number.isInteger(portInfo[portPropName])) {
			const numPorts = portInfo[portPropName];
			if (numPorts < 0 || 255 < numPorts) {
				console.assert(false);
				return null;
			}
			ports.push(...[...new Array(numPorts)].map((_, i) => new MIDIPort({name: makePortName(inOut, (numPorts > 1) ? i + 1 : -1), portPrefix: (numPorts > 1) ? i + 1 : -1})));
		} else if (!(portPropName in portInfo)) {
			ports.push(new MIDIPort({name: makePortName(inOut)}));
		} else {
			console.assert(false);
			return null;
		}
	}

	return ports;

	function makePortName(inOut, portPrefix = -1) {
		const baseCharCode = (inOut === 'Out' && portPrefix <= 0x08) ? 0x40 : 0x30;
		switch (inOut) {
		case 'Out':
			return `${namePrefix}Serial MIDI ${inOut}${(portPrefix > 0) ? ` (Port-${String.fromCharCode(baseCharCode + portPrefix)})` : ''}`;
		case 'In':
			return `${namePrefix}Serial MIDI ${inOut}${(portPrefix > 0) ? ` ${String.fromCharCode(baseCharCode + portPrefix)}` : ''}`;
		default:
			console.assert(false);
			break;
		}
		return null;
	}

	function isValidPortPrefix(portPrefix) {
		if (!Number.isInteger(portPrefix)) {
			return false;
		}
		if (0x01 <= portPrefix && portPrefix <= 0xff) {
			return true;
		}
		if (portPrefix === -1) {
			return true;
		}
		return false;
	}
}

worker?.addEventListener('message', async (e) => {
	const args = e.data;

	switch (args.kind) {
	case 'notifySerialAvailable':
		if (!isSerialAvailable) {
			isSerialAvailable = true;
			await midiAccess._connectAllPorts();
		}
		break;

	case 'notifySerialUnavailable':
		if (isSerialAvailable) {
			isSerialAvailable = false;
			await midiAccess._disconnectAllPorts();
		}
		break;

	case 'notifySerialReadData':
		midiAccess._inputBytes(args.bytes);
		break;

	default:
		console.assert(false);
		break;
	}
});

/* eslint-enable no-underscore-dangle */
