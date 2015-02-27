var DBConfig = {
	version: 2,
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
				y: 13
			},
			{
				name: 'Coraopolis',
				id: 'coraopolis',
				x: 17,
				y: 96
			},
			{
				name: 'LaBarque Creek',
				id: 'labarque-creek',
				x: 9,
				y: 177
			},
			{
				name: 'Evant',
				id: 'evant',
				x: 119,
				y: 43
			},
			{
				name: 'New Amsterdam',
				id: 'new-amsterdam',
				x: 96,
				y: 120
			},
			{
				name: 'Edgefield',
				id: 'edgefield',
				x: 174,
				y: 176
			}
			]
		}
	}

};