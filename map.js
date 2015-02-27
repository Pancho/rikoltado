var Map = (function () {
	var r = {
		draw: function () {
			console.log(111);
			DB.sectors.all(function (sectors) {
				console.log(222);
				var map = $('#map');

				$.each(sectors, function (i, sector) {
					console.log(333);
					var sectorElm = $('<div id="' + sector.id + '"></div>');

					sectorElm.css({
						top: sector.y,
						left: sector.x
					});

					map.append(sectorElm);
				});
			});
		}
	}, u = {
		initialize: function () {
			DB.onReady(r.draw);
		}
	};

	return u;
}());