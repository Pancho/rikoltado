var Player = (function () {
	var r = {
		player: {}
	}, u = {
		getNew: function () {
			r.player = {
				'name': 'Something'
			};

			return r.player;
		},
		save: function () {
			DB.players.update(r.player);
		},
		getPlayer: function () {
			return r.player;
		},
		setPlayer: function (player) {
			r.player = player;
		}
	};

	return u;
}());