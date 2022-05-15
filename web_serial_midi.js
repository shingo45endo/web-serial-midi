import {MidiEventParser, isValidMessageBytes} from './midi_event_parser.js';

const worker = ('serial' in navigator) ? new Worker(import.meta.url.replace(/\/[^/]*$/u, '/serial_worker.js'), {type: 'module'}) : null;

class MIDIPort extends EventTarget {
	constructor(properties) {
		super();

		this._portIndex  = properties?.portIndex  ??  0;
		this._portPrefix = properties?.portPrefix ?? -1;

		const type = (this instanceof MIDIOutput) ? 'out' : 'in';
		this.id = `serial-midi-${type}${(this._portPrefix >= 0) ? `-${String.fromCharCode(0x61 + this._portIndex)}-${this._portPrefix}` : ''}`;
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
//					this._lastPortPrefix = bytes[1];	// TODO: Temporally disabled until multi-port input is supported.
					continue;
				}

				// Dispatches a MIDI input event to input ports.
				for (const port of [...this.inputs.values()].filter((port) => port._portPrefix === this._lastPortPrefix)) {
					port._notifyMidiMessage(bytes);
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

		// Adds default MIDI ports.
		// TODO: Determines the number of each input/output port required by Device Inquiry.
		midiAccess._addPort(new MIDIOutput({name: `Serial MIDI Out`}));
		for (let i = 0; i < 5; i++) {
			midiAccess._addPort(new MIDIOutput({name: `Serial MIDI Out (Port-${String.fromCharCode(0x41 + i)})`, portIndex: i, portPrefix: i + 1}));
		}
		midiAccess._addPort(new MIDIInput({name: `Serial MIDI In`}));

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
