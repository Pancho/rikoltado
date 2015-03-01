var DBConfig = {
	version: 11,
	name: 'rikoltado',
	stores: {
		player: {
			actionOnUpgrade: 'semiSmart',
			key: 'name',
			recoveryRules: {
			},
			indices: [
				{
					name: 'name',
					unique: false
				}
			]
		},
		sectors: {
			actionOnUpgrade: 'empty',
			key: 'id',
			recoveryRules: {

			},
			indices: {

			},
			fixtures: [
				{
				name: 'Emmet',
				id: 'emmet',
				x: 13,
				y: 13,
				population: 1000000
			},
			{
				name: 'Coraopolis',
				id: 'coraopolis',
				x: 17,
				y: 96,
				population: 1000001
			},
			{
				name: 'LaBarque Creek',
				id: 'labarque-creek',
				x: 9,
				y: 177,
				population: 1000002
			},
			{
				name: 'Evant',
				id: 'evant',
				x: 119,
				y: 43,
				population: 1000003
			},
			{
				name: 'New Amsterdam',
				id: 'new-amsterdam',
				x: 96,
				y: 120,
				population: 1000004
			},
			{
				name: 'Edgefield',
				id: 'edgefield',
				x: 174,
				y: 176,
				population: 1000005
			}
			]
		}
	}

};