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

The configuration of `outputs` and `inputs` in `MIDIAccess` returned from this API is automatically set appropriately for the connected devices. Specifically, if the connected device supports multiple ports, `outputs` and `inputs` also have multiple `MIDIOutput` and `MIDIInput`. This module has a database of the Identity Reply returned by MIDI devices and information about the ports supported by the MIDI devices. And, when the API is called, it sends Identity Request to MIDI device and waits for Identity Reply from the MIDI device to get the information of port configuration.

#### Syntax

	Promise<MIDIAccess> requestMIDIAccess([options])

#### Arguments

* `options`:
	* `sysex`: Ignored.


Appendix: List of MIDI devices with serial terminal
---------------------------------------------------

* I: RS-232C (38.4kbps) for IBM-compatible PC
* N: RS-232C (31.25kbps) for NEC PC-98 series
* M: RS-422C (31.25kbps) for Macintosh

### Roland: Sound modules and synthesizers

| Manufacturer | Name        | Ports (O) | Ports (I) | I | N | M | Note |
|--------------|-------------|-----------|-----------|---|---|---|------|
| Roland       | SC-55mkII   |         1 |         1 | x | x | x |      |
| Roland       | SK-50       |         1 |         1 | x | x | x |      |
| Roland       | SC-55ST     |         1 |         1 | x | x | x |      |
| Roland       | SC-7        |         1 |         1 | x | x | x |      |
| Roland       | SC-88       |         2 |         1 | x | x | x | [^1] |
| Roland       | SC-88VL     |         2 |         1 | x | x | x | [^1] |
| Roland       | XP-10       |         1 |         1 | x | x | x |      |
| Roland       | PMA-5       |         1 |         1 | x | x | x |      |
| Roland       | SC-88ST     |         2 |         1 | x | x | x | [^1] |
| Roland       | SC-88Pro    |         2 |         1 | x | x | x | [^1] |
| Roland       | SK-88Pro    |         2 |         1 | x | x | x | [^1] |
| Roland       | SC-88ST Pro |         2 |         1 | x | x | x | [^1] |
| Roland       | SC-880      |         2 |         1 | x | x | x | [^1] |
| Roland ED    | SC-8850     |         5 |         2 | x |   | x | [^2] |
| Roland ED    | SC-8820     |         3 |         2 | x |   | x | [^3] |
| Roland ED    | SK-500      |         3 |         2 | x |   | x | [^4] |
| Edirol       | SD-20       |         2 |         1 | x |   | x | [^1] |
| Roland       | XP-30       |         1 |         1 | x | x | x |      |
| Roland       | JV-1010     |         1 |         1 | x | x | x |      |
| Roland       | XV-88       |         1 |         1 | x |   | x |      |

[^1]: 2 outputs for TG (Part A, B)
[^2]: 4 outputs for TG (Part A-D), 1 output for MIDI-OUT. 1 input from TG, 1 input from MIDI-IN.
[^3]: 2 outputs for TG (Part A, B), 1 output for MIDI-OUT. 1 input from TG, 1 input from MIDI-IN.
[^4]: 2 outputs for TG (Part A, B), 1 output for MIDI-OUT. 1 input from TG, 1 input from keyboard.

### Roland: Digital pianos and intelligent keyboards

| Manufacturer | Name            | Ports (O) | Ports (I) | I | N | M |
|--------------|-----------------|-----------|-----------|---|---|---|
| Roland       | HP-550G         |         1 |         1 | x | x | x |
| Roland       | E-300/KR-75     |         1 |         1 | x | x | x |
| Roland       | HP-335          |         1 |         1 | x | x | x |
| Roland       | HP-535          |         1 |         1 | x | x | x |
| Roland       | HP-555G         |         1 |         1 | x | x | x |
| Roland       | KR-375          |         1 |         1 | x | x | x |
| Roland       | KR-277          |         1 |         1 | x | x | x |
| Roland       | KR-577/977/1077 |         1 |         1 | x | x | x |
| Roland       | HP-337/337R     |         1 |         1 | x | x | x |
| Roland       | HP-557R         |         1 |         1 | x | x | x |
| Roland       | KR-377          |         1 |         1 | x | x | x |
| Roland       | KF-90           |         1 |         1 | x | x | x |
| Roland       | KR-5            |         1 |         1 | x | x | x |
| Roland       | KR-7            |         1 |         1 | x | x | x |
| Roland       | KF-7            |         1 |         1 | x | x | x |
| Roland       | KR-15           |         1 |         1 | x | x | x |
| Roland       | KR-15/17        |         1 |         1 | x | x | x |
| Roland       | MT-300S         |         1 |         1 | x | x | x |
| Roland       | MT-300          |         1 |         1 | x | x | x |
| Roland       | E-38            |         1 |         1 | x | x | x |
| Roland       | E-68            |         1 |         1 | x | x | x |
| Roland       | HP-330/245      |         1 |         1 | x | x | x |
| Roland       | HP-530          |         1 |         1 | x | x | x |
| Roland       | FP-9            |         1 |         1 | x | x | x |
| Roland       | AT-30R          |         1 |         1 | x | x | x |
| Roland       | AT-20R          |         1 |         1 | x | x | x |

### Yamaha: Sound modules and synthesizers

| Manufacturer | Name      | Ports (O) | Ports (I) | I | N | M | Note |
|--------------|-----------|-----------|-----------|---|---|---|------|
| Yamaha       | TG100     |         1 |         1 | x | x | x |      |
| Yamaha       | CBX-T3    |         1 |         1 | x | x | x |      |
| Yamaha       | TG300     |         1 |         1 | x | x | x |      |
| Yamaha       | MU5       |         1 |         1 | x | x | x |      |
| Yamaha       | MU80      |         2 |         1 | x | x | x | [^1] |
| Yamaha       | MU10      |         1 |         1 | x | x | x |      |
| Yamaha       | MU50      |         1 |         1 | x | x | x |      |
| Yamaha       | CBX-K1XG  |         1 |         1 | x | x | x |      |
| Yamaha       | SK1XG     |         1 |         1 | x | x | x |      |
| Yamaha       | CS1x      |         1 |         1 | x | x | x |      |
| Yamaha       | VL70m     |         1 |         1 | x | x | x |      |
| Yamaha       | EOS B2000 |         1 |         1 | x | x | x |      |
| Yamaha       | MU90      |         2 |         1 | x | x | x | [^1] |
| Yamaha       | MU100     |         3 |         1 | x | x | x | [^5] |
| Yamaha       | MU90R     |         2 |         1 | x | x | x | [^1] |
| Yamaha       | QY70      |         1 |         1 | x | x | x |      |
| Yamaha       | MU90B     |         2 |         1 | x | x | x | [^1] |
| Yamaha       | MU100R    |         3 |         1 | x | x | x | [^5] |
| Yamaha       | MU100B    |         3 |         1 | x | x | x | [^5] |
| Yamaha       | MU128     |         5 |         1 | x | x | x | [^6] |
| Yamaha       | CS2x      |         1 |         1 | x | x | x |      |
| Yamaha       | MU15      |         1 |         1 | x | x | x |      |
| Yamaha       | CS6x      |         2 |         1 | x | x | x | [^7] |
| Yamaha       | CS6R      |         2 |         1 | x | x | x | [^7] |
| Yamaha       | S80       |         2 |         1 | x | x | x | [^7] |
| Yamaha       | MU2000    |         5 |         1 | x |   | x | [^6] |
| Yamaha       | MU1000    |         5 |         1 | x |   | x | [^6] |
| Yamaha       | S30       |         2 |         1 | x | x | x | [^7] |
| Yamaha       | QY100     |         1 |         1 | x | x | x |      |
| Yamaha       | MU500     |         2 |         1 | x |   | x | [^1] |
| Yamaha       | S03/S03SL |         1 |         1 | x |   | x |      |
| Yamaha       | EOS BX    |         1 |         1 | x |   | x |      |
| Yamaha       | CBX-D5    |         1 |         1 | x | x | x |      |
| Yamaha       | A7000     |         1 |         1 | x | x | x |      |

[^5]: 2 outputs for internal TG (Part A, B), 1 output for plug-in board. (PLG100-XG)
[^6]: 4 outputs for internal TG (Part A-D), 1 output for plug-in board. (PLG100-XG)
[^7]: 1 output for internal TG, 1 output for plug-in board. (PLG100-XG)

### Yamaha: Drum modules

| Manufacturer | Name         | Ports (O) | Ports (I) | I | N | M |
|--------------|--------------|-----------|-----------|---|---|---|
| Yamaha       | DTXPRESS     |         1 |         1 | x | x | x |
| Yamaha       | DTXTREME     |         1 |         1 | x | x | x |
| Yamaha       | DTXPRESS II  |         1 |         1 | x | x | x |
| Yamaha       | DTXPRESS III |         1 |         1 | x | x | x |

### Yamaha: Digital mixers

| Manufacturer | Name   | Ports (O) | Ports (I) | I | N | M | Note  |
|--------------|--------|-----------|-----------|---|---|---|-------|
| Yamaha       | 03D    |        10 |        10 | x | x | x | [^9]  |
| Yamaha       | 02R    |         1 |         1 | x | ? | x |       |
| Yamaha       | 01V    |         1 |         1 | x | x | x |       |
| Yamaha       | DM2000 |         8 |         8 | x | ? | x | [^10] |
| Yamaha       | 02R96  |         8 |         8 | x | ? | x | [^10] |

[^9]: 8 ports for Port 1-8 (same as MOTU MIDI Time Piece?), 1 port for Port 17, and 1 port for Port ALL. (broadcast)
[^10]: 8 ports for Port 1-8. (same as MOTU MIDI Time Piece?)

### Yamaha: Portatone

| Manufacturer | Name          | Ports (O) | Ports (I) | I | N | M |
|--------------|---------------|-----------|-----------|---|---|---|
| Yamaha       | PSR-730/630   |         1 |         1 | x | x | x |
| Yamaha       | PSR-530       |         1 |         1 | x | x | x |
| Yamaha       | PSR-8000      |         1 |         1 | x | x | x |
| Yamaha       | PSR-740/640   |         1 |         1 | x | x | x |
| Yamaha       | PSR-540       |         1 |         1 | x | x | x |
| Yamaha       | PSR-9000      |         1 |         1 | x | x | x |
| Yamaha       | PSR-550       |         1 |         1 | x | x | x |
| Yamaha       | PSR-2000/1000 |         1 |         1 | x | x | x |

### Yamaha: Clavinova and digital pianos

| Manufacturer | Name                    | Ports (O) | Ports (I) | I | N | M |
|--------------|-------------------------|-----------|-----------|---|---|---|
| Yamaha       | CLP-911/711             |         1 |         1 | x | x | x |
| Yamaha       | CLP-811/611             |         1 |         1 | x | x | x |
| Yamaha       | CLP-511/411             |         1 |         1 | x | x | x |
| Yamaha       | CLP-555                 |         1 |         1 | x | x | x |
| Yamaha       | YDP-301                 |         1 |         1 | x | x | x |
| Yamaha       | J-3000                  |         1 |         1 | x | x | x |
| Yamaha       | CVP-98/96/600           |         1 |         1 | x | x | x |
| Yamaha       | CVP-94/92               |         1 |         1 | x | x | x |
| Yamaha       | MLP-71D                 |         1 |         1 | x | x | x |
| Yamaha       | CLP-880/850/840/820     |         1 |         1 | x | x | x |
| Yamaha       | CLP-870                 |         1 |         1 | x | x | x |
| Yamaha       | CVP-109/107/105/103/700 |         1 |         1 | x | x | x |
| Yamaha       | P-80                    |         1 |         1 | x | x | x |
| Yamaha       | CLP-950/930             |         1 |         1 | x | x | x |
| Yamaha       | CLP-955                 |         1 |         1 | x | x | x |
| Yamaha       | CLP-920                 |         1 |         1 | x | x | x |
| Yamaha       | YDP-321                 |         1 |         1 | x | x | x |
| Yamaha       | J-5000                  |         1 |         1 | x | x | x |
| Yamaha       | CLP-990/990M            |         1 |         1 | x | x | x |
| Yamaha       | CLP-970/970C            |         1 |         1 | x | x | x |
| Yamaha       | CVP-201                 |         1 |         1 | x | x | x |
| Yamaha       | CLP-170/150             |         1 |         1 | x |   | x |
| Yamaha       | P-120/120S              |         1 |         1 | x | x | x |
| Yamaha       | CLP-130                 |         1 |         1 | x | x | x |
| Yamaha       | CVP-209/207/205/203     |         1 |         1 | x | x | x |
| Yamaha       | YDP-223                 |         1 |         1 | x | x | x |
| Yamaha       | P-250                   |         1 |         1 | x |   | x |
| Yamaha       | CVP-202                 |         1 |         1 | x | x | x |
| Yamaha       | P-90                    |         1 |         1 | x | x | x |
| Yamaha       | CLP-F01                 |         1 |         1 | x | x | x |

### Yamaha: Silent piano units

| Manufacturer | Name      | Ports (O) | Ports (I) | I | N | M |
|--------------|-----------|-----------|-----------|---|---|---|
| Yamaha       | PPC500R   |         1 |         1 | x | x | x |
| Yamaha       | PPC500RH  |         1 |         1 | x | x | x |
| Yamaha       | PPC500RXG |         1 |         1 | x | x | x |
| Yamaha       | EMR1      |         1 |         1 | x | x | x |
| Yamaha       | PPC50R    |         1 |         1 | x | x | x |
| Yamaha       | PPC55RCD  |         1 |         1 | x | x | x |
| Yamaha       | PPC55     |         1 |         1 | x | x | x |

### Yamaha: Electone

| Manufacturer | Name       | Ports (O) | Ports (I) | I | N | M |
|--------------|------------|-----------|-----------|---|---|---|
| Yamaha       | EL-900     |         1 |         1 | x | x | x |
| Yamaha       | EL-700/500 |         1 |         1 | x | x | x |
| Yamaha       | EL-400     |         1 |         1 | x | x | x |
| Yamaha       | EL-200     |         1 |         1 | x | x | x |
| Yamaha       | EL-900m    |         1 |         1 | x | x | x |
| Yamaha       | EL-100     |         1 |         1 | x | x | x |
| Yamaha       | MDP-20XG   |         1 |         1 | x | x | x |

### Yamaha: Educational instruments

| Manufacturer | Name       | Ports (O) | Ports (I) | I | N | M |
|--------------|------------|-----------|-----------|---|---|---|
| Yamaha       | SE-4000    |         1 |         1 | x | x | x |
| Yamaha       | SE-3000    |         1 |         1 | x | x | x |
| Yamaha       | SHK-1000   |         1 |         1 | x | x | x |
| Yamaha       | SHK-1000II |         1 |         1 | x | x | x |

### Korg: Sound modules and synthesizers

| Manufacturer | Name      | Ports (O) | Ports (I) | I | N | M | Note |
|--------------|-----------|-----------|-----------|---|---|---|------|
| Korg         | AG-10     |         1 |         1 | x | x | x |      |
| Korg         | AG-3      |         1 |         1 | x | x | x |      |
| Korg         | 05R/W     |         1 |         1 | x | x | x |      |
| Korg         | X5        |         1 |         1 | x | x | x |      |
| Korg         | X5DR      |         1 |         1 | x | x | x |      |
| Korg         | X5D       |         1 |         1 | x | x | x |      |
| Korg         | NS5R/NX5R |         3 |         1 | x | x | x | [^8] |
| Korg         | TR-Rack   |         1 |         1 | x | x | x |      |
| Korg         | N5        |         2 |         1 | x | x | x | [^1] |
| Korg         | N1        |         2 |         1 | x | x | x | [^1] |
| Korg         | N1R       |         2 |         1 | x | x | x | [^1] |
| Korg         | N5EX      |         2 |         1 | x | x | x | [^1] |

[^8]: 2 outputs for internal TG (Part A, B), 1 output for daughter board.

### Korg: Digital pianos and intelligent keyboards

| Manufacturer | Name          | Ports (O) | Ports (I) | I | N | M |
|--------------|---------------|-----------|-----------|---|---|---|
| Korg         | i5S           |         1 |         1 | x | x | x |
| Korg         | XC-3000i      |         1 |         1 | x | x | x |
| Korg         | XC-3000if     |         1 |         1 | x | ? | x |
| Korg         | XC-2000f      |         1 |         1 | x | x | x |
| Korg         | XC-1000       |         1 |         1 | x | x | x |
| Korg         | FC-500/WP-500 |         1 |         1 | x | x | x |
| Korg         | C-700         |         1 |         1 | x | x | x |
| Korg         | C-550         |         1 |         1 | x | x | x |
| Korg         | iS40          |         1 |         1 | x | ? | x |
| Korg         | Ci-800        |         1 |         1 | x | x | x |
| Korg         | C-900         |         1 |         1 | x | x | x |
| Korg         | C-350         |         1 |         1 | x | x | x |
| Korg         | C-710/C-560   |         1 |         1 | x | x | x |
| Korg         | C-8500        |         1 |         1 | x | x | x |
| Korg         | C-4500        |         1 |         1 | x | x | x |
| Korg         | Ci-9600/8600  |         1 |         1 | x | x | x |
| Korg         | Pa80          |         1 |         1 | x | ? | x |

### Kawai: Sound modules and synthesizers

| Manufacturer | Name            | Ports (O) | Ports (I) | I | N | M |
|--------------|-----------------|-----------|-----------|---|---|---|
| Kawai        | XS-2 (GMega)    |         1 |         1 |   |   | x |
| Kawai        | K11             |         1 |         1 |   |   | x |
| Kawai        | GMega L         |         1 |         1 | x | x | x |
| Kawai        | KC20            |         1 |         1 | x | x | x |
| Kawai        | XC-3 (GMega LX) |         1 |         1 | x | x | x |
| Kawai        | XC-1 (GMouse)   |         1 |         1 | x | x | x |
| Kawai        | KC3 (GMCat)     |         1 |         1 | x | x | x |

### Kawai: Digital pianos

| Manufacturer | Name        | Ports (O) | Ports (I) | I | N | M |
|--------------|-------------|-----------|-----------|---|---|---|
| Kawai        | PN370       |         1 |         1 | x | x | x |
| Kawai        | CP150/130   |         1 |         1 | x | x | x |
| Kawai        | PW970/770   |         1 |         1 | x | x | x |
| Kawai        | PN470       |         1 |         1 | x | x | x |
| Kawai        | es1         |         1 |         1 | x | x | x |
| Kawai        | PW1200/1000 |         1 |         1 | x | x | x |
| Kawai        | PN380       |         1 |         1 | x | x | x |
| Kawai        | es2         |         1 |         1 | x | x | x |
| Kawai        | PN390       |         1 |         1 | x | x | x |

### Casio: Sound modules and keyboards

| Manufacturer | Name     | Ports (O) | Ports (I) | I | N | M |
|--------------|----------|-----------|-----------|---|---|---|
| Casio        | GZ-70SP  |         1 |         1 | x | x | x |
| Casio        | GZ-30M   |         1 |         1 | x | x | x |
| Casio        | MZ-2000  |         1 |         1 | x | x | x |
| Casio        | AL-100R  |         1 |         1 | x | x |   |
| Casio        | CTK-625L |         1 |         1 | x | x | x |
| Casio        | LK-01    |         1 |         1 | x | x | x |

### Akai: Sound modules

| Manufacturer | Name  | Ports (O) | Ports (I) | I | N | M |
|--------------|-------|-----------|-----------|---|---|---|
| Akai         | SG01k |         1 |         1 | x | x | x |

### Suzuki: Sound modules

| Manufacturer | Name    | Ports (O) | Ports (I) | I | N | M |
|--------------|---------|-----------|-----------|---|---|---|
| Suzuki       | BH-1000 |         1 |         1 |   | x |   |
| Eniac        | BH-1000 |         1 |         1 | x | x | x |
| Hammond      | GM-1000 |         1 |         1 | x | x | x |

### Suzuki: Educational instruments

| Manufacturer | Name   | Ports (O) | Ports (I) | I | N | M |
|--------------|--------|-----------|-----------|---|---|---|
| Suzuki       | SO-800 |         1 |         1 | x | x | x |
| Suzuki       | SO-670 |         1 |         1 | x | x | x |

### E-mu: Sound modules

| Manufacturer | Name         | Ports (O) | Ports (I) | I | N | M |
|--------------|--------------|-----------|-----------|---|---|---|
| E-mu         | Sound Engine |         1 |         1 |   |   | x |

### Alesis: Sound modules and synthesizers

| Manufacturer | Name      | Ports (O) | Ports (I) | I | N | M |
|--------------|-----------|-----------|-----------|---|---|---|
| Alesis       | QS 6      |         1 |         1 | x | x | x |
| Alesis       | QS 7      |         1 |         1 | x | x | x |
| Alesis       | QS 8      |         1 |         1 | x | x | x |
| Alesis       | QS 6.1    |         1 |         1 | x | x | x |
| Alesis       | QS 7.1    |         1 |         1 | x | x | x |
| Alesis       | QS 8.1    |         1 |         1 | x | x | x |
| Alesis       | QSR       |         1 |         1 | x | x | x |
| Alesis       | NanoSynth |         1 |         1 | x | x | x |

### Ketron: Arranger keyboards and sound modules

| Manufacturer | Name         | Ports (O) | Ports (I) | I | N | M |
|--------------|--------------|-----------|-----------|---|---|---|
| Ketron       | X1/X4/X8     |         1 |         1 | x |   | x |
| Ketron       | SD1/SD1 PLUS |         1 |         1 | x |   | x |
| Ketron       | DG100        |         1 |         1 | x |   | x |
| Ketron       | DG90         |         1 |         1 | x |   | x |
| Ketron       | SD8/SD5/SD3  |         1 |         1 | x |   | x |
| Ketron       | SX3000       |         1 |         1 | x |   | x |
| Ketron       | XD9/XD3      |         1 |         1 | x |   | x |
| Ketron       | VEGA         |         1 |         1 | x |   | x |

### Generalmusic: Arranger keyboards and digital pianos

| Manufacturer | Name                | Ports (O) | Ports (I) | I | N | M |
|--------------|---------------------|-----------|-----------|---|---|---|
| Generalmusic | PS2500/GPS2500      |         1 |         1 | x |   | x |
| Generalmusic | PK7                 |         1 |         1 | x |   | x |
| Generalmusic | WK2                 |         1 |         1 | x |   | x |
| Generalmusic | WK3                 |         1 |         1 | x |   | x |
| Generalmusic | WK4                 |         1 |         1 | x |   | x |
| Generalmusic | SK76/SK88           |         1 |         1 | x |   | x |
| Generalmusic | RP PRO1/RP PRO2     |         1 |         1 | x |   | x |
| Generalmusic | WK6/WK8             |         1 |         1 | x |   | x |
| Generalmusic | WK1000              |         1 |         1 | x |   | x |
| Generalmusic | WK2000 SE           |         1 |         1 | x |   | x |
| Generalmusic | EQUINOX             |         1 |         1 | x |   | x |
| Generalmusic | RP90                |         1 |         1 | x |   | x |
| Generalmusic | RP100/150/200       |         1 |         1 | x |   | x |
| Generalmusic | PS1000/1300         |         1 |         1 | x |   | x |
| Generalmusic | RP220               |         1 |         1 | x |   | x |
| Generalmusic | GPS3600/2600/PS2600 |         1 |         1 | x |   | x |
| Generalmusic | WK1                 |         1 |         1 | x |   | x |
