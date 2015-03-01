var Map = (function () {
	var r = {
		drawMap: function () {
			DB.sectors.all(function (sectors) {
				var map = $('#map');

				$.each(sectors, function (i, sector) {
					var sectorElm = $('<div id="' + sector.id + '"></div>');

					sectorElm.css({
						top: sector.y,
						left: sector.x
					});

					sectorElm.data(sector);

					map.append(sectorElm);
				});
			});
		},
		initSelect: function () {
			var navigation = $('#navigation');

			$('#map').on('click', 'div', function () {
				var sectorElm = $(this),
					info = $('<ul id="info">' +
							'<li class="travel">Travel to</li>' +
							'<li class="scout">Send Scout</li>' +
							'<li class="bribe-police">Bribe Police</li>' +
						'</ul>'),
					actions = $('<ol id="actions"></ol>');

				navigation.find('#info, #actions').remove();

				navigation.append(actions);
				navigation.append(info);
			});
		},
		initHover: function () {
			var navigation = $('#navigation');
			$('#map').on('mouseover', 'div', function (ev) {
				var sectorElm = $(this),
					connector = $('<div class="connector"></div>'),
					heading = $('<h2>' + sectorElm.data('name') + '</h2>');
				// Should the fadeout animation not finish by the time of the new hover, force removal.
				navigation.find('h2, .connector').remove();

				connector.css({
					top: sectorElm.offset().top + 20,
					left: sectorElm.offset().left + sectorElm.outerWidth(true),
					width: navigation.outerWidth(true) - sectorElm.offset().left - sectorElm.outerWidth(true)
				});
				heading.css({
					top: sectorElm.offset().top + 20,
					left: sectorElm.offset().left + sectorElm.outerWidth(true) + connector.outerWidth(true)
				});

				navigation.append(connector);
				navigation.append(heading);
			}).on('mouseout', 'div', function (ev) {
				navigation.find('h2, .connector').fadeOut(200, function () {
					$(this).remove();
				});
			});
		}
	}, u = {
		initialize: function () {
			r.initSelect();
			r.initHover();
			DB.onReady(r.drawMap);
		}
	};

	return u;
}());