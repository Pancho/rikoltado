var Rikoltado = (function () {
	var r = {

	}, u = {
		initialize: function () {
			Navigation.initialize();
			Street.initialize();
			DB.onReady(function () {

			});
		}
	};

	return u;
}());

$(Rikoltado.initialize);