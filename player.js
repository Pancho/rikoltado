var Player = (function () {
	var r = {
		player: null,
		currentCapacity: function (player) {
			var result = 0;

			$.each(player.drugs, function (name, amount) {
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
		getPlayer: function (callback) {
			if (r.player) {
				callback(r.player);
			} else {
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
			}
		},
		setPlayer: function (player) {
			r.player = player;
		},
		sellDrugs: function (drug, amount, callback) {
			u.getPlayer(function (player) {
				$.each(player.currentSector.street, function (i, streetDrug) {
					var price = 0;
					if (streetDrug.name === drug.name) {
						if (player.drugs[drug.name] < amount) {
							amount = player.drugs[drug.name];
						}

						if (amount <= 0) {
							callback({
								error: 'You have to sell something'
							});
							return;
						}

						streetDrug.amount += amount;
						player.cash += (drug.price * amount);
						player.drugs[drug.name] -= amount;
						player.drugCapacity -= amount;

						u.setPlayer(player);
						u.save();
						Navigation.updateDatapad();

						callback({
							success: 'Sold ' + amount + ' ' + (amount === 1 ? streetDrug.unit : streetDrug.unitPlural) + ' of ' + streetDrug.name,
							player: player
						});
					}
				});
			});
		},
		buyDrugs: function (drug, amount, callback) {
			u.getPlayer(function (player) {
				$.each(player.currentSector.street, function (i, streetDrug) {
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

						if (price > player.cash) {
							callback({
								error: 'You don\'t have enough cash',
								helper: 'You can only buy ' + Math.floor(player.cash / streetDrug.price) + ' ' + (Math.floor(player.cash / streetDrug.price) === 1 ? streetDrug.unit : streetDrug.unitPlural)
							});
							return;
						}

						if (r.currentCapacity(player) + amount > player.drugCapacity) {
							callback({
								error: 'You have nowhere to store these drugs',
								helper: 'You can only store ' + (player.drugCapacity - r.currentCapacity(player)) + ' more ' + ((player.drugCapacity - r.currentCapacity(player) === 1 ? streetDrug.unit : streetDrug.unitPlural))
							});
							return;
						}

						// Here chances of getting caught should be resolved

						streetDrug.amount -= amount;
						player.cash -= (drug.price * amount);
						if (!player.drugs[drug.name]) {
							player.drugs[drug.name] = 0;
						}
						player.drugs[drug.name] += amount;
						player.drugCapacity += amount;

						u.setPlayer(player);
						u.save();
						Navigation.updateDatapad();

						callback({
							success: 'Bought ' + amount + ' ' + (amount === 1 ? streetDrug.unit : streetDrug.unitPlural) + ' of ' + streetDrug.name,
							player: player
						});
					}
				});
			});
		}
	};

	return u;
}());