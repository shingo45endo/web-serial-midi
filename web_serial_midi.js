const worker = ('serial' in navigator) ? new Worker(import.meta.url.replace(/\/[^/]*$/u, '/serial_worker.js'), {type: 'module'}) : null;

class MIDIPort extends EventTarget {
	constructor(id, name) {
		super();

		this.id = id;
		this.name = name;
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
	constructor(id, name) {
		super(id, name);

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

		if (!timestamp) {
			timestamp = performance.now();
		}

		// TODO: Checks the payload of MIDI messages.
		let bytes;
		if (data instanceof Uint8Array) {
			bytes = data;
		} else if (Array.isArray(data) && data.every((e) => Number.isInteger(e) && (0 <= e && e < 256))) {
			bytes = new Uint8Array(data);
		}
		if (!bytes) {
			throw new TypeError('Invalid data');
		}

		worker.postMessage({kind: 'MIDIOutput_send', bytes, timestamp});
	}

	clear() {
		// TODO: Implement
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

		// Adds a default MIDI port.
		midiAccess._addPort(new MIDIOutput('serial-midi-out', 'Serial MIDI Out'));

		// Waits for preparation of serial port.
		await new Promise((resolve) => {
			const timerId = setInterval(() => {
				if (isSerialAvailable) {
					clearInterval(timerId);
					resolve();
				}
			}, 100);
		});

		return midiAccess;

	} catch (error) {
		console.error(error);
		throw new DOMException('Failed to use Web Serial API', 'NotSupportedError');
	}
}

worker?.addEventListener('message', async (e) => {
	const args = e.data;

	switch (args.kind) {
	case 'notifySerialAvailable':
		if (!isSerialAvailable) {
			isSerialAvailable = true;
			await Promise.allSettled([...midiAccess._allPorts.values()].filter((port) => port._midiAccess).map((port) => port._connect()));
			[...midiAccess._allPorts.values()].filter((port) => !port._midiAccess).forEach((port) => midiAccess._removePort(port));
		}
		break;

	case 'notifySerialUnavailable':
		if (isSerialAvailable) {
			isSerialAvailable = false;
			await Promise.allSettled([...midiAccess._allPorts.values()].filter((port) => port._midiAccess).map((port) => port._disconnect()));
			[...midiAccess._allPorts.values()].filter((port) => !port._midiAccess).forEach((port) => midiAccess._removePort(port));
		}
		break;

	default:
		console.assert(false);
		break;
	}
});

/* eslint-enable no-underscore-dangle */
