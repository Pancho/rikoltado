var DBConfig = {
	version: 14,
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
		drugs: {
			actionOnUpgrade: 'empty',
			key: 'name',
			recoveryRules: {},
			indices: [
				{
					name: 'name',
					unique: false
				}
			],
			fixtures: [
				{
					name: 'Heroin',
					minPrice: 400,
					maxPrice: 500,
					unit: 'Gram',
					unitPlural: 'Grams'
				},
				{
					name: 'Morphine',
					minPrice: 8,
					maxPrice: 12,
					unit: 'Gram',
					unitPlural: 'Grams'
				},
				{
					name: 'Opium',
					minPrice: 15,
					maxPrice: 20,
					unit: 'Gram',
					unitPlural: 'Grams'
				},
				{
					name: 'Amphetamine',
					minPrice: 20,
					maxPrice: 35,
					unit: 'Gram',
					unitPlural: 'Grams'
				},
				{
					name: 'Methamphetamine',
					minPrice: 90,
					maxPrice: 130,
					unit: 'Gram',
					unitPlural: 'Grams'
				},
				{
					name: 'Ecstasy',
					minPrice: 15,
					maxPrice: 25,
					unit: 'Tablet',
					unitPlural: 'Tablets'
				},
				{
					name: 'Marijuana',
					minPrice: 8,
					maxPrice: 12,
					unit: 'Gram',
					unitPlural: 'Grams'
				},
				{
					name: 'Mushrooms',
					minPrice: 7,
					maxPrice: 10,
					unit: 'Gram',
					unitPlural: 'Grams'
				},
				{
					name: 'LSD',
					minPrice: 8,
					maxPrice: 12,
					unit: 'Gram',
					unitPlural: 'Grams'
				},
				{
					name: 'Cocaine',
					minPrice: 130,
					maxPrice: 160,
					unit: 'Gram',
					unitPlural: 'Grams'
				},
				{
					name: 'Crack Cocaine',
					minPrice: 190,
					maxPrice: 230,
					unit: 'Gram',
					unitPlural: 'Grams'
				}
			]
		},
		sectors: {
			actionOnUpgrade: 'empty',
			key: 'id',
			recoveryRules: {},
			indices: [
				{
					name: 'name',
					unique: false
				}
			],
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