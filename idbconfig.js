var DBConfig = {
	version: 1,
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
		}
	}

};