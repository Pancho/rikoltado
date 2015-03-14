var Navigation = (function () {
	var r = {
		policePresence: {
			.1: 'Casual',
			.3: 'Aware',
			.5: 'On lookout',
			.7: 'Ambush'
		},
		policePresenceKeys: [.1,.3,.5,.7],
		drawMap: function () {
			var map = $('#map'),
				player = Player.getPlayer();

			$.each(Player.getPlayer().sectors, function (i, sector) {
				var sectorElm = $('<div id="' + sector.id + '"></div>');

				sectorElm.css({
					top: sector.y,
					left: sector.x
				});

				sectorElm.data(sector);

				map.append(sectorElm);
			});

			$('#map div').removeClass('selected');
			$('#' + player.currentSector.id).addClass('selected');

			Street.draw();
		},
		initSelect: function () {
			var navigation = $('#navigation'),
				player = Player.getPlayer();

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
		},
		generateRandomPromises: function () {
			var result = {};

			result.policePresence = Utils.randomChoice();

			return result;
		},
		getPromises: function (player, callback) {
			var promises = {};

			promises.rivalPresence = Math.random();
			promises.policePresence = Utils.randomChoice(r.policePresenceKeys);
			promises.priceMultiplier = Math.random() + promises.policePresence + promises.rivalPresence; // Need to include a random event here (higher yields, D.E.A. operations...)

			return promises;
		},
		initActions: function () {
			var navigation = $('#navigation');

			navigation.on('click', '.travel', function () {
				var sector = Player.getSector($('#actions').data()),
					player = Player.getPlayer();

				$('#selected-sector').text('Currently in ' + sector.name);

				Drugs.generateDrugState(sector.promises, function (pricelist) {
					var sectorElm = $('#map').find('div');
					navigation.find('#info, #actions').remove();
					sector.street = pricelist;
					player.currentSector = sector;
					Player.save();
					sectorElm.removeClass('selected');
					$('#' + player.currentSector.id).addClass('selected');
					u.applyPromises(player);
					Street.draw(player);
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
		applyPromises: function (player) {
			var i = 0,
				j = player.sectors.length;

			for (; i < j; i+= 1) {
				player.sectors[i].promises = r.getPromises(player)
			}
		},
		updateDatapad: function () {
			var player = Player.getPlayer();

			$('#selected-sector').text('Currently in ' + player.currentSector.name);
			$('#wealth .cash .amount').text('$ ' + player.cash.toFixed(2));
			$('#wealth .laundered .amount').text('$ ' + player.laundered.toFixed(2));
			$('#wealth .loan .amount').text('$ ' + player.loan.toFixed(2));

			$('#map div').removeClass('selected');
			$('#' + player.currentSector.id).addClass('selected');
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