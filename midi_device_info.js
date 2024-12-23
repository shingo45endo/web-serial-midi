const devices = Object.freeze([
	// Roland
	{
		mfrName: 'Roland', deviceName: 'HP-330/245',
		mfrId: [0x41], deviceFamily: [0x1a, 0x00], deviceFamilyMember: [0x00, 0x02], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'HP-530',
		mfrId: [0x41], deviceFamily: [0x1a, 0x00], deviceFamilyMember: [0x00, 0x02], softwareRevision: [0x01, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'FP-9',
		mfrId: [0x41], deviceFamily: [0x1a, 0x00], deviceFamilyMember: [0x00, 0x04], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'KR-370',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x00], softwareRevision: [0x0b, 0x00, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'XP-10',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x02, 0x01], softwareRevision: [0x09, 0x01, 0x00, 0x01],
	},
	{
		mfrName: 'Roland', deviceName: 'PMA-5',	// GM/GS Sound Module Mode
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x0c, 0x01], softwareRevision: [0x00, 0x00, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'SC-88ST',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x02], softwareRevision: [-1, -1, -1, -1],
		outputPorts: 2,
	},
	{
		mfrName: 'Roland', deviceName: 'HP-550G/KR-570',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x03], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'E-300/KR-75',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x01, 0x03], softwareRevision: [0x00, 0x01, 0x00, 0x01],
	},
	{
		mfrName: 'Roland', deviceName: 'HP-335',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x02, 0x03], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'HP-535',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x02, 0x03], softwareRevision: [0x01, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'HP-555G',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x02, 0x03], softwareRevision: [0x02, 0x01, 0x00, 0x01],
	},
	{
		mfrName: 'Roland', deviceName: 'KR-375',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x02, 0x03], softwareRevision: [0x03, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'MT-300S',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x03, 0x03], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'KR-575',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x04, 0x03], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'AT-20R',	// Mode 1
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x05, 0x03], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'AT-30R',	// Mode 1
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x05, 0x03], softwareRevision: [0x01, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'AT-60R',	// Mode 1
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x05, 0x03], softwareRevision: [0x02, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'AT-80R',	// Mode 1
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x05, 0x03], softwareRevision: [0x03, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'AT-90R',	// Mode 1
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x05, 0x03], softwareRevision: [0x04, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'KR-277',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x06, 0x03], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'SC-88Pro',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x04], softwareRevision: [-1, -1, -1, -1],
		outputPorts: 2,
	},
	{
		mfrName: 'Roland', deviceName: 'SC-880',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x04], softwareRevision: [0x04, 0x00, 0x00, 0x00],
		outputPorts: 2,
	},
	{
		mfrName: 'Roland ED', deviceName: 'SC-8850',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x06], softwareRevision: [0x00, 0x00, 0x00, 0x00],
		outputPorts: [
			{name: 'SC-8850 Serial MIDI Out (Port-A)'},
			{name: 'SC-8850 Serial MIDI Out (Port-B)'},
			{name: 'SC-8850 Serial MIDI Out (Port-C)'},
			{name: 'SC-8850 Serial MIDI Out (Port-D)'},
			{name: 'SC-8850 Serial MIDI Out (MIDI OUT 1)'},
		],
		inputPorts: [
			{name: 'SC-8850 Serial MIDI In (TG)',        portPrefix: 0x01},
			{name: 'SC-8850 Serial MIDI In (MIDI IN 1)', portPrefix: 0x05},
		],
	},
	{
		mfrName: 'Roland ED', deviceName: 'SC-8820',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x07], softwareRevision: [0x00, 0x00, 0x00, 0x00],
		outputPorts: [
			{name: 'SC-8820 Serial MIDI Out (Port-A)'},
			{name: 'SC-8820 Serial MIDI Out (Port-B)'},
			{name: 'SC-8820 Serial MIDI Out (MIDI OUT)'},
		],
		inputPorts: [
			{name: 'SC-8820 Serial MIDI In (TG)',      portPrefix: 0x01},
			{name: 'SC-8820 Serial MIDI In (MIDI IN)', portPrefix: 0x03},	// Not confirmed
		],
	},
	{
		mfrName: 'Roland', deviceName: 'KR-577/977/1077',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x08], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'HP-337/337R',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x09], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'HP-557R',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x01, 0x09], softwareRevision: [0x00, 0x01, 0x00, 0x01],
	},
	{
		mfrName: 'Roland', deviceName: 'KR-377',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x02, 0x09], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'KF-90',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x02, 0x09], softwareRevision: [0x01, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Edirol', deviceName: 'SD-20',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x0c], softwareRevision: [-1, -1, -1, -1],
		outputPorts: 2,
	},
	{
		mfrName: 'Roland', deviceName: 'KR-5',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x0d], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'KR-7',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x0e], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'KF-7',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x0e], softwareRevision: [0x01, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'KR-15',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x0f], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'KR-15/17',
		mfrId: [0x41], deviceFamily: [0x42, 0x00], deviceFamilyMember: [0x00, 0x0f], softwareRevision: [0x01, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'AT-20R',	// Mode 2
		mfrId: [0x41], deviceFamily: [0x62, 0x00], deviceFamilyMember: [0x00, 0x00], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'AT-30R',	// Mode 2
		mfrId: [0x41], deviceFamily: [0x62, 0x00], deviceFamilyMember: [0x00, 0x00], softwareRevision: [0x01, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'AT-60R',	// Mode 2
		mfrId: [0x41], deviceFamily: [0x62, 0x00], deviceFamilyMember: [0x00, 0x01], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'AT-80R',	// Mode 2
		mfrId: [0x41], deviceFamily: [0x62, 0x00], deviceFamilyMember: [0x01, 0x01], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'AT-90R',	// Mode 2
		mfrId: [0x41], deviceFamily: [0x62, 0x00], deviceFamilyMember: [0x01, 0x01], softwareRevision: [0x01, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'XP-30',
		mfrId: [0x41], deviceFamily: [0x6a, 0x00], deviceFamilyMember: [0x04, 0x00], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'JV-1010',
		mfrId: [0x41], deviceFamily: [0x6a, 0x00], deviceFamilyMember: [0x05, 0x00], softwareRevision: [0x00, 0x00, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'PMA-5',	// Normal Mode
		mfrId: [0x41], deviceFamily: [0x05, 0x01], deviceFamilyMember: [0x00, 0x00], softwareRevision: [0x00, 0x06, 0x00, 0x00],
	},
	{
		mfrName: 'Roland', deviceName: 'XV-88',
		mfrId: [0x41], deviceFamily: [0x10, 0x01], deviceFamilyMember: [0x00, 0x00], softwareRevision: [0x00, 0x01, 0x00, 0x00],
	},

	// Yamaha
	{
		mfrName: 'Yamaha', deviceName: 'A7000',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x00, 0x64], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'MU50',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x46, 0x01], softwareRevision: [0x00, 0x00, 0x00, 0x01],
	},
	{
		mfrName: 'Yamaha', deviceName: 'CBX-K1XG',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x6b, 0x01], softwareRevision: [0x00, 0x00, 0x00, 0x01],
	},
	{
		mfrName: 'Yamaha', deviceName: 'SK1XG',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x7a, 0x01], softwareRevision: [0x00, 0x00, 0x00, 0x01],
	},
	{
		mfrName: 'Yamaha', deviceName: 'CS1x',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x10, 0x02], softwareRevision: [0x00, 0x00, 0x00, 0x01],
	},
	{
		mfrName: 'Yamaha', deviceName: 'VL70m',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x0c, 0x02], softwareRevision: [0x00, 0x00, 0x00, 0x02],
	},
	{
		mfrName: 'Yamaha', deviceName: 'EOS B2000',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x2d, 0x02], softwareRevision: [0x00, 0x00, 0x00, 0x01],
	},
	{
		mfrName: 'Yamaha', deviceName: 'MU90',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x37, 0x02], softwareRevision: [0x00, 0x00, 0x00, 0x01],
		outputPorts: 2,
	},
	{
		mfrName: 'Yamaha', deviceName: 'MU100',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x38, 0x02], softwareRevision: [0x00, 0x00, 0x00, 0x01],
		outputPorts: 3,
	},
	{
		mfrName: 'Yamaha', deviceName: 'MU90R',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x52, 0x02], softwareRevision: [0x00, 0x00, 0x00, 0x01],
		outputPorts: 2,
	},
	{
		mfrName: 'Yamaha', deviceName: 'QY70',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x02, 0x55], softwareRevision: [0x00, 0x00, 0x00, 0x01],
	},
	{
		mfrName: 'Yamaha', deviceName: 'MU90B',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x70, 0x02], softwareRevision: [0x00, 0x00, 0x00, 0x01],
		outputPorts: 2,
	},
	{
		mfrName: 'Yamaha', deviceName: 'MU100R',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x00, 0x03], softwareRevision: [0x00, 0x00, 0x00, 0x01],
		outputPorts: 3,
	},
	{
		mfrName: 'Yamaha', deviceName: 'MU100B',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x36, 0x03], softwareRevision: [0x00, 0x00, 0x00, 0x01],
		outputPorts: 3,
	},
	{
		mfrName: 'Yamaha', deviceName: 'MU128',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x42, 0x03], softwareRevision: [0x00, 0x00, 0x00, 0x01],
		outputPorts: 5,
	},
	{
		mfrName: 'Yamaha', deviceName: 'CS2x',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x4f, 0x03], softwareRevision: [0x00, 0x00, 0x00, 0x01],
	},
	{
		mfrName: 'Yamaha', deviceName: 'MU15',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x51, 0x03], softwareRevision: [0x00, 0x00, 0x00, 0x01],
	},
	{
		mfrName: 'Yamaha', deviceName: 'CS6x',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x5c, 0x03], softwareRevision: [0x00, 0x00, 0x00, 0x01],
		outputPorts: 2,
	},
	{
		mfrName: 'Yamaha', deviceName: 'CS6R',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x5d, 0x03], softwareRevision: [0x00, 0x00, 0x00, 0x01],
		outputPorts: 2,
	},
	{
		mfrName: 'Yamaha', deviceName: 'S80',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x5e, 0x03], softwareRevision: [0x00, 0x00, 0x00, 0x01],
		outputPorts: 2,
	},
	{
		mfrName: 'Yamaha', deviceName: 'MU2000',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x1b, 0x04], softwareRevision: [0x00, 0x00, 0x00, 0x01],
		outputPorts: 5,
	},
	{
		mfrName: 'Yamaha', deviceName: 'MU1000',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x1c, 0x04], softwareRevision: [0x00, 0x00, 0x00, 0x01],
		outputPorts: 5,
	},
	{
		mfrName: 'Yamaha', deviceName: 'S30',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x23, 0x04], softwareRevision: [0x00, 0x00, 0x00, 0x7f],
		outputPorts: 2,
	},
	{
		mfrName: 'Yamaha', deviceName: 'QY100',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x04, 0x34], softwareRevision: [0x00, 0x00, 0x00, 0x01],
	},
	{
		mfrName: 'Yamaha', deviceName: 'MU500',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x71, 0x04], softwareRevision: [0x00, 0x00, 0x00, 0x01],
		outputPorts: 4,
	},
	{
		mfrName: 'Yamaha', deviceName: 'S03/S03SL',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x77, 0x04], softwareRevision: [0x00, 0x00, 0x00, 0x01],
	},
	{
		mfrName: 'Yamaha', deviceName: 'EOS BX',
		mfrId: [0x43], deviceFamily: [0x00, 0x41], deviceFamilyMember: [0x79, 0x04], softwareRevision: [0x00, 0x00, 0x00, 0x01],
	},

	{
		mfrName: 'Yamaha', deviceName: 'CVP-92',
		mfrId: [0x43], deviceFamily: [0x00, 0x43], deviceFamilyMember: [0x06, 0x0a], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'CVP-94',
		mfrId: [0x43], deviceFamily: [0x00, 0x43], deviceFamilyMember: [0x08, 0x0a], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'CVP-96',
		mfrId: [0x43], deviceFamily: [0x00, 0x43], deviceFamilyMember: [0x0a, 0x0a], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'CVP-98',
		mfrId: [0x43], deviceFamily: [0x00, 0x43], deviceFamilyMember: [0x0e, 0x0a], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'CLP-870',
		mfrId: [0x43], deviceFamily: [0x00, 0x43], deviceFamilyMember: [0x3c, 0x14], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'CVP-103',
		mfrId: [0x43], deviceFamily: [0x00, 0x43], deviceFamilyMember: [0x4f, 0x14], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'CVP-105',
		mfrId: [0x43], deviceFamily: [0x00, 0x43], deviceFamilyMember: [0x50, 0x14], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'CVP-107',
		mfrId: [0x43], deviceFamily: [0x00, 0x43], deviceFamilyMember: [0x51, 0x14], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'CVP-109',
		mfrId: [0x43], deviceFamily: [0x00, 0x43], deviceFamilyMember: [0x52, 0x14], softwareRevision: [-1, -1, -1, -1],
	},

	{
		mfrName: 'Yamaha', deviceName: 'PSR-530/B50',
		mfrId: [0x43], deviceFamily: [0x00, 0x44], deviceFamilyMember: [0x18, 0x0a], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'PSR-630',
		mfrId: [0x43], deviceFamily: [0x00, 0x44], deviceFamilyMember: [0x19, 0x0a], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'PSR-730',
		mfrId: [0x43], deviceFamily: [0x00, 0x44], deviceFamilyMember: [0x1a, 0x0a], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'PSR-8000',
		mfrId: [0x43], deviceFamily: [0x00, 0x44], deviceFamilyMember: [0x1c, 0x0a], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'PSR-540',
		mfrId: [0x43], deviceFamily: [0x00, 0x44], deviceFamilyMember: [0x5c, 0x14], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'PSR-640',
		mfrId: [0x43], deviceFamily: [0x00, 0x44], deviceFamilyMember: [0x5d, 0x14], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'PSR-740',
		mfrId: [0x43], deviceFamily: [0x00, 0x44], deviceFamilyMember: [0x5e, 0x14], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'PSR-9000',
		mfrId: [0x43], deviceFamily: [0x00, 0x44], deviceFamilyMember: [0x5f, 0x14], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Yamaha', deviceName: 'PSR-9000Pro',
		mfrId: [0x43], deviceFamily: [0x00, 0x44], deviceFamilyMember: [0x64, 0x14], softwareRevision: [-1, -1, -1, -1],
	},

	{
		mfrName: 'Yamaha', deviceName: 'DTXPRESS',
		mfrId: [0x43], deviceFamily: [0x00, 0x4c], deviceFamilyMember: [0x72, 0x07], softwareRevision: [0x00, 0x00, 0x00, 0x00],
	},
	{
		mfrName: 'Yamaha', deviceName: 'DTXTREME',
		mfrId: [0x43], deviceFamily: [0x00, 0x4c], deviceFamilyMember: [0x73, 0x07], softwareRevision: [-1, 0x00, 0x00, 0x00],
	},
	{
		mfrName: 'Yamaha', deviceName: 'DTXPRESS II',
		mfrId: [0x43], deviceFamily: [0x00, 0x4c], deviceFamilyMember: [0x02, 0x08], softwareRevision: [-1, 0x00, 0x00, 0x00],
	},
	{
		mfrName: 'Yamaha', deviceName: 'DTXPRESS III',
		mfrId: [0x43], deviceFamily: [0x00, 0x4c], deviceFamilyMember: [0x18, 0x08], softwareRevision: [-1, 0x00, 0x00, 0x00],
	},

	// Korg
	{
		mfrName: 'Korg', deviceName: '05R/W',
		mfrId: [0x42], deviceFamily: [0x36, 0x00], deviceFamilyMember: [0x00, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
	},
	{
		mfrName: 'Korg', deviceName: 'X5',
		mfrId: [0x42], deviceFamily: [0x36, 0x00], deviceFamilyMember: [0x09, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
	},
	{
		mfrName: 'Korg', deviceName: 'X5DR',
		mfrId: [0x42], deviceFamily: [0x36, 0x00], deviceFamilyMember: [0x14, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
	},
	{
		mfrName: 'Korg', deviceName: 'X5D',
		mfrId: [0x42], deviceFamily: [0x36, 0x00], deviceFamilyMember: [0x1d, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
	},
	{
		mfrName: 'Korg', deviceName: 'i5S/iS40',
		mfrId: [0x42], deviceFamily: [0x39, 0x00], deviceFamilyMember: [0x04, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
	},
	{
		mfrName: 'Korg', deviceName: 'Ci-800/C-900/Ci-9600/8600',
		mfrId: [0x42], deviceFamily: [0x39, 0x00], deviceFamilyMember: [0x06, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
	},
	{
		mfrName: 'Korg', deviceName: 'TR-Rack',
		mfrId: [0x42], deviceFamily: [0x3b, 0x00], deviceFamilyMember: [0x20, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
	},
	{
		mfrName: 'Korg', deviceName: 'XC-3000i',
		mfrId: [0x42], deviceFamily: [0x43, 0x00], deviceFamilyMember: [0x06, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
	},
	{
		mfrName: 'Korg', deviceName: 'XC-3000if',
		mfrId: [0x42], deviceFamily: [0x43, 0x00], deviceFamilyMember: [0x07, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
	},
	{
		mfrName: 'Korg', deviceName: 'XC-2000f/C-700',
		mfrId: [0x42], deviceFamily: [0x43, 0x00], deviceFamilyMember: [0x0d, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
	},
	{
		mfrName: 'Korg', deviceName: 'XC-1000/FC-500/WP-500/C-550',
		mfrId: [0x42], deviceFamily: [0x43, 0x00], deviceFamilyMember: [0x1d, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
	},
	{
		mfrName: 'Korg', deviceName: 'i30',
		mfrId: [0x42], deviceFamily: [0x49, 0x00], deviceFamilyMember: [0x00, 0x00], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Korg', deviceName: 'N5',
		mfrId: [0x42], deviceFamily: [0x4c, 0x00], deviceFamilyMember: [0x05, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
		outputPorts: [
			{name: 'N5 Serial MIDI Out (Port-A)', portPrefix: 0x02},
			{name: 'N5 Serial MIDI Out (Port-B)', portPrefix: 0x03},
		],
	},
	{
		mfrName: 'Korg', deviceName: 'N1',
		mfrId: [0x42], deviceFamily: [0x4c, 0x00], deviceFamilyMember: [0x0f, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
		outputPorts: [
			{name: 'N1 Serial MIDI Out (Port-A)', portPrefix: 0x02},
			{name: 'N1 Serial MIDI Out (Port-B)', portPrefix: 0x03},
		],
	},
	{
		mfrName: 'Korg', deviceName: 'N1R',
		mfrId: [0x42], deviceFamily: [0x4c, 0x00], deviceFamilyMember: [0x14, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
		outputPorts: [
			{name: 'N1R Serial MIDI Out (Port-A)', portPrefix: 0x02},
			{name: 'N1R Serial MIDI Out (Port-B)', portPrefix: 0x03},
		],
	},
	{
		mfrName: 'Korg', deviceName: 'N5EX',
		mfrId: [0x42], deviceFamily: [0x4c, 0x00], deviceFamilyMember: [0x1d, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
		outputPorts: [
			{name: 'N5EX Serial MIDI Out (Port-A)', portPrefix: 0x02},
			{name: 'N5EX Serial MIDI Out (Port-B)', portPrefix: 0x03},
		],
	},
	{
		mfrName: 'Korg', deviceName: 'NS5R/NX5R',
		mfrId: [0x42], deviceFamily: [0x4c, 0x00], deviceFamilyMember: [0x42, 0x00], softwareRevision: [-1, 0x00, -1, 0x00],
		outputPorts: [
			{name: 'NS5R/NX5R Serial MIDI Out (Port-A)', portPrefix: 0x02},
			{name: 'NS5R/NX5R Serial MIDI Out (Port-B)', portPrefix: 0x03},
			{name: 'NS5R/NX5R Serial MIDI Out (Port-C)', portPrefix: 0x01},
		],
	},
	{
		mfrName: 'Korg', deviceName: 'C-8500',
		mfrId: [0x42], deviceFamily: [0x56, 0x00], deviceFamilyMember: [0x07, 0x00], softwareRevision: [-1, -1, -1, -1],
	},
	{
		mfrName: 'Korg', deviceName: 'C-4500',
		mfrId: [0x42], deviceFamily: [0x56, 0x00], deviceFamilyMember: [0x0f, 0x00], softwareRevision: [-1, -1, -1, -1],
	},
]);

export function analyzeIdentityReply(bytes) {
	if (!bytes.length || (bytes.length !== 15 && bytes.length !== 17)) {
		return null;
	}

	// Parses the result of Identity Reply.
	let index = 5;
	const mfrIdLen = (bytes[index] !== 0x00) ? 1 : 3;
	const mfrId = bytes.slice(index, index + mfrIdLen);
	index += mfrIdLen;
	const deviceFamily = bytes.slice(index, index + 2);
	index += 2;
	const deviceFamilyMember = bytes.slice(index, index + 2);
	index += 2;
	const softwareRevision = bytes.slice(index, index + 4);
	index += 4;
	const ret = {mfrId, deviceFamily, deviceFamilyMember, softwareRevision};

	// Narrows candidates by device family code.
	const deviceFamilyStr = deviceFamily.toString();
	const sameFamilyDevices = devices.filter((e) => e.deviceFamily.toString() === deviceFamilyStr);
	if (sameFamilyDevices.length === 0) {
		return ret;
	} else if (sameFamilyDevices.length === 1) {
		return {...sameFamilyDevices[0], ...ret};
	}

	// Narrows candidates by device family member code.
	const deviceFamilyMemberStr = deviceFamilyMember.toString();
	const sameKindDevices = sameFamilyDevices.filter((e) => e.deviceFamilyMember.toString() === deviceFamilyMemberStr);
	if (sameKindDevices.length === 0) {
		console.assert(sameFamilyDevices.length > 0);
		return {...sameFamilyDevices[0], ...ret};
	} else if (sameKindDevices.length === 1) {
		return {...sameKindDevices[0], ...ret};
	}

	// Narrows candidates by software revision level.
	const sameTypeDevices = sameKindDevices.filter((e) => {
		console.assert(e.softwareRevision.length === 4);
		for (let i = 0; i < 4; i++) {
			const byte = e.softwareRevision[i];
			if (byte >= 0 && byte !== softwareRevision[i]) {
				return false;
			}
		}
		return true;
	});
	if (sameTypeDevices.length === 0) {
		return {...sameKindDevices[0], ...ret};
	}

	console.assert(sameTypeDevices.length > 0);
	return {...sameTypeDevices[0], ...ret};
}
