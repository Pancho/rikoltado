var Rikoltado = (function () {
	var r = {

	}, u = {
		initialize: function () {
			DB.onReady(function () {
				Player.loadPlayer(function () {
					Navigation.initialize();
					Street.initialize();
				});
			});
		}
	};

	return u;
}());

$(Rikoltado.initialize);