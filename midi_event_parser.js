const lengthTables = Object.freeze([
	...[...new Array(16)].fill(3),	// 0x80: Note Off
	...[...new Array(16)].fill(3),	// 0x90: Note On
	...[...new Array(16)].fill(3),	// 0xa0: Polyphonic Key Pressure
	...[...new Array(16)].fill(3),	// 0xb0: Control Change
	...[...new Array(16)].fill(2),	// 0xc0: Program Change
	...[...new Array(16)].fill(2),	// 0xd0: Channel Pressure
	...[...new Array(16)].fill(3),	// 0xe0: Pitch Bend Change
	0,	// 0xf0: System Exclusive Message
	2,	// 0xf1: MIDI Time Code Quarter Frame
	3,	// 0xf2: Song Position Pointer
	2,	// 0xf3: Song Select
	1,	// 0xf4: Undefined
	2,	// 0xf5: Undefined (Used as Port Select unofficially, but Web MIDI API doesn't allow any parameter)
	1,	// 0xf6: Tune Request
	1,	// 0xf7: End of System Exclusive
	1,	// 0xf8: Timing Clock
	1,	// 0xf9: Undefined
	1,	// 0xfa: Start
	1,	// 0xfb: Continue
	1,	// 0xfc: Stop
	1,	// 0xfd: Undefined
	1,	// 0xfe: Active Sensing
	1,	// 0xff: System Reset
]);
console.assert(lengthTables.length === 128);

const checkers = lengthTables.map((len) => {
	switch (len) {
	case 3:
		return (bytes) => (bytes.length === 3 && (bytes[1] & 0x80) === 0 && (bytes[2] & 0x80) === 0);

	case 2:
		return (bytes) => (bytes.length === 2 && (bytes[1] & 0x80) === 0);

	case 1:
		return (bytes) => (bytes.length === 1);

	case 0:
		return (bytes) => (bytes[0] === 0xf0 && bytes[bytes.length - 1] === 0xf7 && bytes.slice(1, -1).every((e) => (e & 0x80) === 0));

	default:
		console.assert(false);
		break;
	}
	return null;
});

function getMessageLength(statusByte) {
	if ((statusByte & 0x80) === 0) {
		return -1;
	}
	return lengthTables[statusByte - 0x80];
}

function isValidMessage(bytes) {
	return checkers[bytes[0] - 0x80](bytes);
}

export function isValidMessageBytes(bytes) {
	if (!('length' in bytes)) {
		return false;
	}

	let index = 0;
	while (index < bytes.length) {
		let len = getMessageLength(bytes[index]);
		if (len < 0) {
			return false;
		} else if (len === 0) {
			const indexF7 = bytes.indexOf(0xf7, index + 1);
			if (indexF7 < 0) {
				return false;
			}
			len = indexF7 - index + 1;
		}

		if (!isValidMessage(bytes.slice(index, index + len))) {
			return false;
		}
		index += len;
	}

	return true;
}

const FIFO_OFFSET = 1;
class FifoBuffer {
	constructor(byteLength) {
		console.assert(byteLength >= FIFO_OFFSET);
		this._buf = new Uint8Array(byteLength);
		this.clear();
	}

	get buffer() {
		return this._viewBuf;
	}

	clear() {
		this._reset();
		this._updateBuffer();
	}

	pushBack(bytes) {
		console.assert(bytes instanceof Uint8Array);

		// Extends the buffer if necessary.
		if (this._indexTail + bytes.byteLength > this._buf.byteLength) {
			const needsLength = (this._indexTail - this._indexHead) + bytes.byteLength;
			if (needsLength > this._buf.byteLength - FIFO_OFFSET) {
				// Extends the buffer and copies the remaining data to the new buffer.
				const newBuf = new Uint8Array(Math.max(this._buf.byteLength * 2, needsLength));
				newBuf.set(new Uint8Array(this._buf.buffer, this._indexHead, this._indexTail - this._indexHead), FIFO_OFFSET);
				this._buf = newBuf;
			} else {
				// Copies the remaining data from/to the current buffer.
				this._buf.copyWithin(FIFO_OFFSET, this._indexHead, this._indexTail);
			}
			const newIndexTail = FIFO_OFFSET + (this._indexTail - this._indexHead);
			this._indexHead = FIFO_OFFSET;
			this._indexTail = newIndexTail;
		}

		// Appends the data to the tail of the buffer.
		this._buf.set(bytes, this._indexTail);
		this._indexTail += bytes.byteLength;
		this._updateBuffer();
	}

	popFront(byteLength) {
		console.assert(this._indexHead + byteLength <= this._indexTail);
		const ret = new Uint8Array(this._buf.buffer, this._indexHead, byteLength);
		this._indexHead += byteLength;
		this._updateBuffer();
		return ret;
	}

	trashFront(byteLength) {
		console.assert(this._indexHead + byteLength <= this._indexTail);
		this._indexHead += byteLength;
		this._updateBuffer();
	}

	pushFront1Byte(byte) {
		console.assert(this._indexHead >= FIFO_OFFSET);
		this._indexHead -= 1;
		this._buf[this._indexHead] = byte;
		this._updateBuffer();
	}

	_reset() {
		this._indexHead = FIFO_OFFSET;
		this._indexTail = FIFO_OFFSET;
	}

	_updateBuffer() {
		console.assert(0 <= this._indexHead && this._indexHead <= this._buf.buffer.byteLength);
		console.assert(0 <= this._indexTail && this._indexTail <= this._buf.buffer.byteLength);
		console.assert(this._indexHead <= this._indexTail);

		if (this._indexHead === this._indexTail) {
			this._reset();
		}

		this._viewBuf = new Uint8Array(this._buf.buffer, this._indexHead, this._indexTail - this._indexHead);
	}
}

export class MidiEventParser {
	constructor() {
		this._fifoBuf = new FifoBuffer(65536);
		this.reset();
	}

	reset() {
		this._runningStatus = 0x00;
		this._events = [];
		this._fifoBuf.clear();
	}

	isEmpty() {
		return this._fifoBuf.length === 0;
	}

	popEvents() {
		const ret = this._events.map((e) => new Uint8Array(e));
		this._events = [];
		return ret;
	}

	pushBytes(bytes) {
		const fifo = this._fifoBuf;

		// Appends the data to the FIFO.
		const indicesRealTime = [...bytes].map((e, i) => (e >= 0xf8) ? i : -1).filter((i) => (i >= 0));
		if (indicesRealTime.length === 0) {
			fifo.pushBack(bytes);
		} else {
			// Pushes real-time MIDI messages.
			for (const index of indicesRealTime) {
				this._events.push(new Uint8Array(bytes.buffer, index, 1));
			}

			// Appends the data to the FIFO excluding real-time message bytes.
			let indexBegin = 0;
			for (const indexEnd of [...indicesRealTime, bytes.length]) {
				fifo.pushBack(bytes.slice(indexBegin, indexEnd));
				indexBegin = indexEnd + 1;
			}
		}

		// Parses the data in the FIFO.
		while (fifo.buffer.length > 0) {
			// If the first byte isn't MSB-set, tries to apply running status byte.
			if ((fifo.buffer[0] & 0x80) === 0) {
				// If running status byte cannot be applied, trashes the first byte and restarts parsing.
				if ((this._runningStatus & 0x80) === 0) {
					console.warn('Trashed 1 byte');
					fifo.trashFront(1);
					continue;
				}

				fifo.pushFront1Byte(this._runningStatus);
			}

			// Checks if the rest buffer can be considered as a MIDI event.
			const statusByte = fifo.buffer[0];
			console.assert((statusByte & 0x80) !== 0);
			if (statusByte === 0xf7) {
				// Trashes single EOX byte and restarts parsing the rest buffer from the next byte.
				console.warn('Trashed F7');
				fifo.trashFront(1);
				this._runningStatus = 0x00;
				continue;

			} else if (statusByte !== 0xf0) {
				// If the current buffer doesn't contain complete MIDI message, exits the loop.
				const len = getMessageLength(statusByte);
				if (len > fifo.buffer.length) {
					break;
				}

				// Checks whether the new MIDI message is valid or not.
				const eventBytes = fifo.buffer.slice(0, len);
				if (!isValidMessage(eventBytes)) {
					// Trashes the first byte and restarts parsing.
					console.warn('Trashed 1 byte');
					fifo.trashFront(1);
					this._runningStatus = 0x00;
					continue;

				} else {
					// Pushes a MIDI message.
					console.assert(isValidMessage(eventBytes));
					this._events.push(eventBytes);
					fifo.trashFront(len);
					this._runningStatus = getNewRunningStatus(statusByte, this._runningStatus);
				}

			} else {	// In case of SysEx
				this._runningStatus = 0x00;

				// Finds an MSB-set byte.
				const indexMsb = fifo.buffer.findIndex((e, i) => (i > 0 && (e & 0x80) !== 0));
				if (indexMsb < 0) {
					// Exits the loop to wait for subsequent bytes by calling next pushBytes().
					break;
				}
				const msbByte = fifo.buffer[indexMsb];
				if (msbByte !== 0xf7) {
					// Trashes wrong bytes and restarts parsing the rest buffer from the next MSB-set byte.
					console.warn(`Trashed ${indexMsb} byte(s)`);
					fifo.trashFront(indexMsb);
					console.assert((fifo.buffer[0] & 0x80) !== 0);
					continue;
				}

				// Pushes a SysEx message.
				const len = indexMsb + 1;
				const eventBytes = fifo.popFront(len);
				console.assert(isValidMessage(eventBytes));
				this._events.push(eventBytes);
			}
		}
	}
}

function getNewRunningStatus(statusByte, runningStatus) {
	console.assert((statusByte & 0x80) !== 0);

	if (statusByte < 0xf0) {
		return statusByte;
	} else if (statusByte < 0xf8) {
		return 0x00;
	} else {
		return runningStatus;
	}
}
