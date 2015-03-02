var Player = (function () {
	var r = {
		player: null,
		getNew: function (callback) {
			r.player = {
				name: 'The Dealer',
				created: new Date(),
				loan: 50000,
				cash: 1000,
				laundered: 0
			};

			DB.sectors.all(function (sectors) {
				r.player.currentSector = Utils.randomChoice(sectors);
				u.save();

				callback(r.player);
			});
		}
	}, u = {
		save: function () {
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
		}
	};

	return u;
}());