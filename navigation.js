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

					actions = $('<ul id="actions">' +
							'<li class="travel" title="Travel to this sector">Travel to</li>' +
							'<li class="informant" title="Informant will report their expectations for the prices in this sector">Call Informant</li>' +
							'<li class="bribe-police" title="Bribe the police in this sector so you are less likely to be attacked">Bribe Police</li>' +
							'<li class="sabotage-rivals" title="Sabotage rivals in your trade, so you will be more likely to have exclusive offer">Sabotage Rivals</li>' +
						'</ul>'),
					info = $('<ol id="info">' +
						'<li>' + sectorElm.data('name') + '</li>' +
						'<li>Population - ' + sectorElm.data('population') + '</li>' +
						'</ol>');

				navigation.find('#info, #actions').remove();

				navigation.append(info);
				navigation.append(actions);
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