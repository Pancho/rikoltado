var Navigation = (function () {
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

				Player.getPlayer(function (player) {
					$('#map div').removeClass('selected');
					$('#' + player.currentSector.id).addClass('selected');
				});

				Street.draw();
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

				Player.getPlayer(function (player) {
					if (player.currentSector.name !== sectorElm.data('name')) {
						navigation.find('#info, #actions').remove();
						actions.data(sectorElm.data());
						info.data(sectorElm.data());
						navigation.append(info);
						navigation.append(actions);
						$('#map div').removeClass('selected');
						$('#' + player.currentSector.id).addClass('selected');
					}
				});

			});
		},
		getPromises: function (player, callback) {
			var promises = {};

			console.log($('#map .selected'));

			promises.priceMultiplier = 1;

			callback(promises);
		},
		initActions: function () {
			var navigation = $('#navigation');

			navigation.on('click', '.travel', function () {
				var blob = $('#actions').data();
				$('#selected-sector').text('Currently in ' + blob.name);
				Player.getPlayer(function (player) {
					r.getPromises(player, function (promises) {
						Drugs.generateDrugState(promises, function (pricelist) {
							navigation.find('#info, #actions').remove();
							blob.street = pricelist;
							player.currentSector = blob;
							Player.save();
							$('#map div').removeClass('selected');
							$('#' + player.currentSector.id).addClass('selected');
							Street.draw(player);
						});
					});
				});
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
		updateDatapad: function () {
			Player.getPlayer(function (player) {
				$('#selected-sector').text('Currently in ' + player.currentSector.name);
				$('#wealth .cash .amount').text('$ ' + player.cash.toFixed(2));
				$('#wealth .laundered .amount').text('$ ' + player.laundered.toFixed(2));
				$('#wealth .loan .amount').text('$ ' + player.loan.toFixed(2));

				$('#map div').removeClass('selected');
				$('#' + player.currentSector.id).addClass('selected');
			});
		},
		initialize: function () {
			r.initSelect();
			r.initHover();
			DB.onReady(r.drawMap);
			DB.onReady(u.updateDatapad);
			DB.onReady(r.initActions);
		}
	};

	return u;
}());