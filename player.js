var Player = (function () {
	var r = {
		player: null,
		currentCapacity: function () {
			var result = 0;

			$.each(r.player.drugs, function (name, amount) {
				result += amount;
			});

			return result;
		},
		getNew: function (callback) {
			DB.sectors.all(function (sectors) {
				Drugs.generateDrugState({}, function (pricelist) {
					r.player = {
						name: 'The Dealer',
						created: new Date(),
						loan: 50000,
						cash: 1000,
						laundered: 0,
						drugs: {},
						drugCapacity: 200,
						extraCapacity: [],
						armor: {},
						weapon: {},
						currentSector: Utils.randomChoice(sectors)
					};
					r.player.currentSector.street = pricelist;
					u.save();
					callback(r.player);
				});
			});
		}
	}, u = {
		save: function (player) {
			DB.player.update(r.player);
		},
		getPlayer: function () {
			return r.player;
		},
		setPlayer: function (player) {
			r.player = player;
		},
		loadPlayer: function (callback) {
			DB.player.all(function (players) {
				if (!players || players.length === 0) {
					r.getNew(callback);
				} else {
					players.sort(function (a, b) {
						return new Date(b.created) - new Date(a.created);
					});

					r.player = players[0];

					callback(r.player);
				}
			});
		},
		sellDrugs: function (drug, amount, callback) {
			$.each(r.player.currentSector.street, function (i, streetDrug) {
				var price = 0;
				if (streetDrug.name === drug.name) {
					if (r.player.drugs[drug.name] < amount) {
						amount = r.player.drugs[drug.name];
					}

					if (amount <= 0) {
						callback({
							error: 'You have to sell something'
						});
						return;
					}

					streetDrug.amount += amount;
					r.player.cash += (drug.price * amount);
					r.player.drugs[drug.name] -= amount;
					r.player.drugCapacity += amount;

					u.save();
					Navigation.updateDatapad();

					callback({
						success: 'Sold ' + amount + ' ' + (amount === 1 ? streetDrug.unit : streetDrug.unitPlural) + ' of ' + streetDrug.name,
						player: r.player
					});
				}
			});
		},
		buyDrugs: function (drug, amount, callback) {
			$.each(r.player.currentSector.street, function (i, streetDrug) {
				var price = 0;
				if (streetDrug.name === drug.name) {
					if (amount > streetDrug.amount) {
						amount = streetDrug.amount;
					}
					price = drug.price * amount;

					if (amount < 0) {
						callback({
							error: 'You have to buy something'
						});
						return;
					}

					if (price > r.player.cash) {
						callback({
							error: 'You don\'t have enough cash',
							helper: 'You can only buy ' + Math.floor(r.player.cash / streetDrug.price) + ' ' + (Math.floor(r.player.cash / streetDrug.price) === 1 ? streetDrug.unit : streetDrug.unitPlural)
						});
						return;
					}

					if (r.currentCapacity() + amount > r.player.drugCapacity) {
						callback({
							error: 'You have nowhere to store these drugs',
							helper: 'You can only store ' + (r.player.drugCapacity - r.currentCapacity()) + ' more ' + ((r.player.drugCapacity - r.currentCapacity() === 1 ? streetDrug.unit : streetDrug.unitPlural))
						});
						return;
					}

					// Here chances of getting caught should be resolved

					streetDrug.amount -= amount;
					r.player.cash -= (drug.price * amount);
					if (!r.player.drugs[drug.name]) {
						r.player.drugs[drug.name] = 0;
					}
					r.player.drugs[drug.name] += amount;
					r.player.drugCapacity -= amount;

					u.setPlayer(r.player);
					u.save();
					Navigation.updateDatapad();

					callback({
						success: 'Bought ' + amount + ' ' + (amount === 1 ? streetDrug.unit : streetDrug.unitPlural) + ' of ' + streetDrug.name,
						player: r.player
					});
				}
			});
		}
	};

	return u;
}());