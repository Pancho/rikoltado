var Rikoltado = (function () {
	var r = {

	}, u = {
		initialize: function () {
			Engine.initialize();
			Engine.animate();
			Controls.initialize();
			DB.onReady(function () {

			});
		}
	};

	return u;
}());

$(Rikoltado.initialize);