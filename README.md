web-serial-midi
===============

What is this?
-------------

This module provides APIs (with [Web MIDI API](https://www.w3.org/TR/webmidi/)-like I/F) to control MIDI sound modules with serial port terminal by using [Web Serial API](https://wicg.github.io/serial/).

A moment of time in the past, before the widespread of USB for MIDI devices, some MIDI modules had Mini-DIN-8 "serial terminal" for connection to computers. Those serial ports can be used as both MIDI IN and OUT. (Since MIDI and serial communication methods are very similar, a method of direct connection between MIDI sound module to computer's RS-232C/422 terminal was devised to drive them.) This module's APIs can drive such MIDI devices with serial terminal.


API
---

### prepareForSerialMidi

Sets up a serial port for MIDI. This API calls [serial.requestPort](https://wicg.github.io/serial/#requestport-method) to prompt the user to choose a port. Due to the restriction of this API, it must be triggered by user interaction, such as clicking a button.

After resolved the returned promise successfully, the promise returned by `requestMIDIAccess` can be settled.

#### Syntax

	Promise<SerialPort> prepareForSerialMidi([settings])

#### Arguments

* `settings`: The following properties are passed as options of `SerialPort.open([options])`: [*](https://wicg.github.io/serial/#dom-serialoptions)
	* `baudRate`: `31250` or `38400` should be specified.
	* `flowControl`: `none` or `hardware` shall be specified.
	* `bufferSize`: More than 0.

### requestMIDIAccess

Returns a Promise object representing a request for access to MIDI devices connected by the serial port set up by `prepareForSerialMidi`. This API is provided as a stand-alone function. (Not as a member of `navigator`)

#### Syntax

	Promise<MIDIAccess> requestMIDIAccess([options])

#### Arguments

* `options`:
	* `sysex`: Ignored.


Appendix: List of MIDI devices with serial terminal
---------------------------------------------------

### Roland: Sound modules and synthesizers

| Manufacturer | Name        | Ports (O) | Ports (I) | Note |
|--------------|-------------|-----------|-----------|------|
| Roland       | SC-55mkII   |         1 |         1 |      |
| Roland       | SK-50       |         1 |         1 |      |
| Roland       | SC-55ST     |         1 |         1 |      |
| Roland       | SC-7        |         1 |         1 |      |
| Roland       | SC-88       |         2 |         1 | [^1] |
| Roland       | SC-88VL     |         2 |         1 | [^1] |
| Roland       | XP-10       |         1 |         1 |      |
| Roland       | PMA-5       |         1 |         1 |      |
| Roland       | SC-88ST     |         2 |         1 | [^1] |
| Roland       | SC-88Pro    |         2 |         1 | [^1] |
| Roland       | SK-88Pro    |         2 |         1 | [^1] |
| Roland       | SC-88ST Pro |         2 |         1 | [^1] |
| Roland       | SC-880      |         2 |         1 | [^1] |
| Roland ED    | SC-8850     |         5 |         2 | [^2] |
| Roland ED    | SC-8820     |         3 |         2 | [^3] |
| Roland ED    | SK-500      |         3 |         2 | [^3] |
| Edirol       | SD-20       |         2 |         1 | [^1] |
| Roland       | XP-30       |         1 |         1 |      |
| Roland       | JV-1010     |         1 |         1 |      |
| Roland       | XV-88       |         1 |         1 |      |

[^1]: 2 outputs for TG (Part A, B)
[^2]: 4 outputs for TG (Part A-D), 1 output for MIDI-OUT. 1 input from TG, 1 input from MIDI-IN.
[^3]: 2 outputs for TG (Part A, B), 1 output for MIDI-OUT. 1 input from TG, 1 input from MIDI-IN.

### Roland: Digital pianos and intelligent keyboards

| Manufacturer | Name            | Ports (O) | Ports (I) |
|--------------|-----------------|-----------|-----------|
| Roland       | HP-550G         |         1 |         1 |
| Roland       | E-300/KR-75     |         1 |         1 |
| Roland       | HP-335          |         1 |         1 |
| Roland       | HP-535          |         1 |         1 |
| Roland       | HP-555G         |         1 |         1 |
| Roland       | KR-375          |         1 |         1 |
| Roland       | KR-277          |         1 |         1 |
| Roland       | KR-577/977/1077 |         1 |         1 |
| Roland       | HP-337/337R     |         1 |         1 |
| Roland       | HP-557R         |         1 |         1 |
| Roland       | KR-377          |         1 |         1 |
| Roland       | KF-90           |         1 |         1 |
| Roland       | KR-5            |         1 |         1 |
| Roland       | KR-7            |         1 |         1 |
| Roland       | KF-7            |         1 |         1 |
| Roland       | KR-15           |         1 |         1 |
| Roland       | KR-15/17        |         1 |         1 |
| Roland       | MT-300S         |         1 |         1 |
| Roland       | MT-300          |         1 |         1 |
| Roland       | E-38            |         1 |         1 |
| Roland       | E-68            |         1 |         1 |
| Roland       | HP-330/245      |         1 |         1 |
| Roland       | HP-530          |         1 |         1 |
| Roland       | FP-9            |         1 |         1 |
| Roland       | AT-30R          |         1 |         1 |
| Roland       | AT-20R          |         1 |         1 |

### Yamaha: Sound modules and synthesizers

| Manufacturer | Name      | Ports (O) | Ports (I) | Note |
|--------------|-----------|-----------|-----------|------|
| Yamaha       | TG100     |         1 |         1 |      |
| Yamaha       | CBX-T3    |         1 |         1 |      |
| Yamaha       | TG300     |         1 |         1 |      |
| Yamaha       | MU5       |         1 |         1 |      |
| Yamaha       | MU80      |         2 |         1 | [^1] |
| Yamaha       | MU10      |         1 |         1 |      |
| Yamaha       | MU50      |         1 |         1 |      |
| Yamaha       | CBX-K1XG  |         1 |         1 |      |
| Yamaha       | SK1XG     |         1 |         1 |      |
| Yamaha       | CS1x      |         1 |         1 |      |
| Yamaha       | VL70m     |         1 |         1 |      |
| Yamaha       | EOS B2000 |         1 |         1 |      |
| Yamaha       | MU90      |         2 |         1 | [^1] |
| Yamaha       | MU100     |         3 |         1 | [^4] |
| Yamaha       | MU90R     |         2 |         1 | [^1] |
| Yamaha       | QY70      |         1 |         1 |      |
| Yamaha       | MU90B     |         2 |         1 | [^1] |
| Yamaha       | MU100R    |         3 |         1 | [^4] |
| Yamaha       | MU100B    |         3 |         1 | [^4] |
| Yamaha       | MU128     |         5 |         1 | [^5] |
| Yamaha       | CS2x      |         1 |         1 |      |
| Yamaha       | MU15      |         1 |         1 |      |
| Yamaha       | CS6x      |         2 |         1 | [^6] |
| Yamaha       | CS6R      |         2 |         1 | [^6] |
| Yamaha       | S80       |         2 |         1 | [^6] |
| Yamaha       | MU2000    |         5 |         1 | [^5] |
| Yamaha       | MU1000    |         5 |         1 | [^5] |
| Yamaha       | S30       |         2 |         1 | [^6] |
| Yamaha       | QY100     |         1 |         1 |      |
| Yamaha       | MU500     |         2 |         1 | [^1] |
| Yamaha       | S03/S03SL |         1 |         1 |      |
| Yamaha       | EOS BX    |         1 |         1 |      |
| Yamaha       | CBX-D5    |         1 |         1 |      |
| Yamaha       | A7000     |         1 |         1 |      |

[^4]: 2 outputs for internal TG (Part A, B), 1 output for plug-in board. (PLG100-XG)
[^5]: 4 outputs for internal TG (Part A-D), 1 output for plug-in board. (PLG100-XG)
[^6]: 1 output for internal TG, 1 output for plug-in board. (PLG100-XG)

### Yamaha: Drum modules

| Manufacturer | Name         | Ports (O) | Ports (I) |
|--------------|--------------|-----------|-----------|
| Yamaha       | DTXPRESS     |         1 |         1 |
| Yamaha       | DTXTREME     |         1 |         1 |
| Yamaha       | DTXPRESS II  |         1 |         1 |
| Yamaha       | DTXPRESS III |         1 |         1 |

### Yamaha: Digital mixers

| Manufacturer | Name   | Ports (O) | Ports (I) | Note |
|--------------|--------|-----------|-----------|------|
| Yamaha       | 03D    |        10 |        10 | [^8] |
| Yamaha       | 02R    |         1 |         1 |      |
| Yamaha       | 01V    |         1 |         1 |      |
| Yamaha       | DM2000 |         8 |         8 | [^9] |
| Yamaha       | 02R96  |         8 |         8 | [^9] |

[^8]: 8 ports for Port 1-8 (same as MOTU MIDI Time Piece?), 1 port for Port 17, and 1 port for Port ALL. (broadcast)
[^9]: 8 ports for Port 1-8. (same as MOTU MIDI Time Piece?)

### Yamaha: Portatone

| Manufacturer | Name          | Ports (O) | Ports (I) |
|--------------|---------------|-----------|-----------|
| Yamaha       | PSR-730/630   |         1 |         1 |
| Yamaha       | PSR-530       |         1 |         1 |
| Yamaha       | PSR-8000      |         1 |         1 |
| Yamaha       | PSR-740/640   |         1 |         1 |
| Yamaha       | PSR-540       |         1 |         1 |
| Yamaha       | PSR-9000      |         1 |         1 |
| Yamaha       | PSR-550       |         1 |         1 |
| Yamaha       | PSR-2000/1000 |         1 |         1 |

### Yamaha: Clavinova and digital pianos

| Manufacturer | Name                    | Ports (O) | Ports (I) |
|--------------|-------------------------|-----------|-----------|
| Yamaha       | CLP-911/711             |         1 |         1 |
| Yamaha       | CLP-811/611             |         1 |         1 |
| Yamaha       | CLP-511/411             |         1 |         1 |
| Yamaha       | CLP-555                 |         1 |         1 |
| Yamaha       | YDP-301                 |         1 |         1 |
| Yamaha       | J-3000                  |         1 |         1 |
| Yamaha       | CVP-98/96/600           |         1 |         1 |
| Yamaha       | CVP-94/92               |         1 |         1 |
| Yamaha       | MLP-71D                 |         1 |         1 |
| Yamaha       | CLP-880/850/840/820     |         1 |         1 |
| Yamaha       | CLP-870                 |         1 |         1 |
| Yamaha       | CVP-109/107/105/103/700 |         1 |         1 |
| Yamaha       | P-80                    |         1 |         1 |
| Yamaha       | CLP-950/930             |         1 |         1 |
| Yamaha       | CLP-955                 |         1 |         1 |
| Yamaha       | CLP-920                 |         1 |         1 |
| Yamaha       | YDP-321                 |         1 |         1 |
| Yamaha       | J-5000                  |         1 |         1 |
| Yamaha       | CLP-990/990M            |         1 |         1 |
| Yamaha       | CLP-970/970C            |         1 |         1 |
| Yamaha       | CVP-201                 |         1 |         1 |
| Yamaha       | CLP-170/150             |         1 |         1 |
| Yamaha       | P-120/120S              |         1 |         1 |
| Yamaha       | CLP-130                 |         1 |         1 |
| Yamaha       | CVP-209/207/205/203     |         1 |         1 |
| Yamaha       | YDP-223                 |         1 |         1 |
| Yamaha       | P-250                   |         1 |         1 |
| Yamaha       | CVP-202                 |         1 |         1 |
| Yamaha       | P-90                    |         1 |         1 |
| Yamaha       | CLP-F01                 |         1 |         1 |

### Yamaha: Silent piano units

| Manufacturer | Name      | Ports (O) | Ports (I) |
|--------------|-----------|-----------|-----------|
| Yamaha       | PPC500R   |         1 |         1 |
| Yamaha       | PPC500RH  |         1 |         1 |
| Yamaha       | PPC500RXG |         1 |         1 |
| Yamaha       | EMR1      |         1 |         1 |
| Yamaha       | PPC50R    |         1 |         1 |
| Yamaha       | PPC55RCD  |         1 |         1 |
| Yamaha       | PPC55     |         1 |         1 |

### Yamaha: Electone

| Manufacturer | Name       | Ports (O) | Ports (I) |
|--------------|------------|-----------|-----------|
| Yamaha       | EL-900     |         1 |         1 |
| Yamaha       | EL-700/500 |         1 |         1 |
| Yamaha       | EL-400     |         1 |         1 |
| Yamaha       | EL-200     |         1 |         1 |
| Yamaha       | EL-900m    |         1 |         1 |
| Yamaha       | EL-100     |         1 |         1 |
| Yamaha       | MDP-20XG   |         1 |         1 |

### Yamaha: Educational instruments

| Manufacturer | Name       | Ports (O) | Ports (I) |
|--------------|------------|-----------|-----------|
| Yamaha       | SE-4000    |         1 |         1 |
| Yamaha       | SE-3000    |         1 |         1 |
| Yamaha       | SHK-1000   |         1 |         1 |
| Yamaha       | SHK-1000II |         1 |         1 |

### Korg: Sound modules and synthesizers

| Manufacturer | Name      | Ports (O) | Ports (I) | Note |
|--------------|-----------|-----------|-----------|------|
| Korg         | AG-10     |         1 |         1 |      |
| Korg         | AG-3      |         1 |         1 |      |
| Korg         | 05R/W     |         1 |         1 |      |
| Korg         | X5        |         1 |         1 |      |
| Korg         | X5DR      |         1 |         1 |      |
| Korg         | X5D       |         1 |         1 |      |
| Korg         | NS5R/NX5R |         3 |         1 | [^7] |
| Korg         | TR-Rack   |         1 |         1 |      |
| Korg         | N5        |         2 |         1 | [^1] |
| Korg         | N1        |         2 |         1 | [^1] |
| Korg         | N1R       |         2 |         1 | [^1] |
| Korg         | N5EX      |         2 |         1 | [^1] |

[^7]: 2 outputs for internal TG (Part A, B), 1 output for daughter board.

### Korg: Digital pianos and intelligent keyboards

| Manufacturer | Name          | Ports (O) | Ports (I) |
|--------------|---------------|-----------|-----------|
| Korg         | i5S           |         1 |         1 |
| Korg         | XC-3000i      |         1 |         1 |
| Korg         | XC-3000if     |         1 |         1 |
| Korg         | XC-2000f      |         1 |         1 |
| Korg         | XC-1000       |         1 |         1 |
| Korg         | FC-500/WP-500 |         1 |         1 |
| Korg         | C-700         |         1 |         1 |
| Korg         | C-550         |         1 |         1 |
| Korg         | iS40          |         1 |         1 |
| Korg         | Ci-800        |         1 |         1 |
| Korg         | C-900         |         1 |         1 |
| Korg         | C-350         |         1 |         1 |
| Korg         | C-710/C-560   |         1 |         1 |
| Korg         | C-8500        |         1 |         1 |
| Korg         | C-4500        |         1 |         1 |
| Korg         | Ci-9600/8600  |         1 |         1 |
| Korg         | Pa80          |         1 |         1 |

### Kawai: Sound modules and synthesizers

| Manufacturer | Name            | Ports (O) | Ports (I) | Note |
|--------------|-----------------|-----------|-----------|------|
| Kawai        | XS-2 (GMega)    |         1 |         1 | [^10]|
| Kawai        | K11             |         1 |         1 | [^10]|
| Kawai        | KC20            |         1 |         1 |      |
| Kawai        | XC-3 (GMega LX) |         1 |         1 |      |
| Kawai        | XC-1 (GMouse)   |         1 |         1 |      |
| Kawai        | KC3 (GMCat)     |         1 |         1 |      |

[^10]: Supports only Macintosh. (RS-422)

### Kawai: Digital pianos

| Manufacturer | Name        | Ports (O) | Ports (I) |
|--------------|-------------|-----------|-----------|
| Kawai        | PN370       |         1 |         1 |
| Kawai        | CP150/130   |         1 |         1 |
| Kawai        | PW970/770   |         1 |         1 |
| Kawai        | PN470       |         1 |         1 |
| Kawai        | es1         |         1 |         1 |
| Kawai        | PW1200/1000 |         1 |         1 |
| Kawai        | PN380       |         1 |         1 |
| Kawai        | es2         |         1 |         1 |
| Kawai        | PN390       |         1 |         1 |

### Casio: Sound modules and keyboards

| Manufacturer | Name     | Ports (O) | Ports (I) |
|--------------|----------|-----------|-----------|
| Casio        | GZ-70SP  |         1 |         1 |
| Casio        | GZ-30M   |         1 |         1 |
| Casio        | MZ-2000  |         1 |         1 |
| Casio        | AL-100R  |         1 |         1 |
| Casio        | CTK-625L |         1 |         1 |
| Casio        | LK-01    |         1 |         1 |

### Akai: Sound modules

| Manufacturer | Name  | Ports (O) | Ports (I) |
|--------------|-------|-----------|-----------|
| Akai         | SG01k |         1 |         1 |

### Suzuki: Sound modules

| Manufacturer | Name    | Ports (O) | Ports (I) | Note |
|--------------|---------|-----------|-----------|------|
| Suzuki       | BH-1000 |         1 |         1 | [^11]|
| Eniac        | BH-1000 |         1 |         1 |      |
| Hammond      | GM-1000 |         1 |         1 |      |

[^11]: Supports only 31.25kbps.

### Suzuki: Educational instruments

| Manufacturer | Name   | Ports (O) | Ports (I) |
|--------------|--------|-----------|-----------|
| Suzuki       | SO-800 |         1 |         1 |
| Suzuki       | SO-670 |         1 |         1 |

### E-mu: Sound modules

| Manufacturer | Name         | Ports (O) | Ports (I) | Note |
|--------------|--------------|-----------|-----------|------|
| E-mu         | Sound Engine |         1 |         1 | [^10]|

[^10]: Supports only Macintosh. (RS-422)

### Alesis: Sound modules and synthesizers

| Manufacturer | Name      | Ports (O) | Ports (I) |
|--------------|-----------|-----------|-----------|
| Alesis       | QS 6      |         1 |         1 |
| Alesis       | QS 7      |         1 |         1 |
| Alesis       | QS 8      |         1 |         1 |
| Alesis       | QS 6.1    |         1 |         1 |
| Alesis       | QS 7.1    |         1 |         1 |
| Alesis       | QS 8.1    |         1 |         1 |
| Alesis       | QSR       |         1 |         1 |
| Alesis       | NanoSynth |         1 |         1 |
