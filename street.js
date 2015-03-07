var Street = (function () {
	var r = {
		updateTransactionValue: function () {
			var transaction = $('#transaction');

			transaction.find('.calculation, .result').remove();

			transaction.find('fieldset').append('<p class="calculation">' + transaction.find('.amount').val() + ' X $' + transaction.data('price') + '</p>');
			transaction.find('fieldset').append('<p class="result ' + transaction.data('side') + '">$' + (parseInt(transaction.find('.amount').val(), 10) * transaction.data('price')).toFixed(2) + '</p>');
		},
		updateStreetContents: function (streetDrugs, playerDrugs) {
			var streetContents = $('#street-contents ul'),
				playerContents = $('#player-contents ul'),
				streetPriceMap = {};

			streetContents.empty();
			playerContents.empty();

			streetContents.data(streetDrugs);
			playerContents.data(playerDrugs);

			$.each(streetDrugs, function (i, drug) {
				var item = $('<li></li>');

				streetPriceMap[drug.name] = drug.price;

				if (drug.amount > 0) {
					item.data(drug);
					item.data('side', 'buy');
					item.append('<span class="name">' + drug.name + '</span>');
					item.append('<span class="price">$ ' + drug.price.toFixed(2) + '</span>');
					item.append('<span class="amount" title="' + (drug.amount === 1 ? drug.unit : drug.unitPlural) + '">' + drug.amount + '</span>');
					streetContents.append(item);
				}
			});

			$.each(playerDrugs, function (name, amount) {
				var item = $('<li></li>');

				if (amount > 0) {
					item.data({
						side: 'sell',
						name: name,
						amount: amount,
						price: streetPriceMap[name]
					});

					item.append('<span class="name">' + name + '</span>');
					item.append('<span class="amount">' + amount + '</span>');
					playerContents.append(item);
				}
			});
		},
		fillStreetContents: function (streetDrugs, playerDrugs) {
			var city = $('#city'),
				street = $('<div id="street">' +
						'<div class="drugs" id="street-contents"><h2>Drugs on the street</h2><ul></ul></div>' +
						'<div class="transaction" id="transaction"></div>' +
						'<div class="drugs" id="player-contents"><h2>Your drugs</h2><ul></ul></div>' +
					'</div>');

			u.destroy();
			city.append(street);
			r.updateStreetContents(streetDrugs, playerDrugs);
		},
		initDrugSelection: function () {
			var city = $('#city');

			city.on('click', '#street-contents li, #player-contents li', function (ev) {
				var transaction = $('#transaction'),
					listItem = $(this);

				$('#street-contents, #player-contents').find('li').removeClass('selected');
				listItem.addClass('selected');

				transaction.empty();
				transaction.data(listItem.data());
				transaction.data('side', listItem.data('side'));

				if (listItem.data('side') === 'buy') {
					transaction.append('<form>' +
							'<fieldset>' +
								'<legend>Buy</legend>' +
								'<ol>' +
									'<li>' +
										'<label for="amount">Amount</label>' +
										'<input class="buy amount" type="number" id="amount" name="number" required="required" min="1" placeholder="0" step="1" /> ' +
									'</li>' +
								'</ol>' +
								'<ol class="shortcuts">' +
									'<li data-amount="10">+10</li>' +
									'<li data-amount="100">+100</li>' +
									'<li data-amount="all">All</li>' +
									'<li data-amount="-10">-10</li>' +
									'<li data-amount="-100">-100</li>' +
									'<li data-amount="0">0</li>' +
								'</ol>' +
								'<div class="control">' +
									'<input type="submit" class="button" id="submit" name="submit" value="Buy" />' +
								'</div>' +
							'</fieldset>' +
						'</form>');
				} else {
					transaction.append('<form>' +
							'<fieldset>' +
								'<legend>Sell</legend>' +
								'<ol>' +
									'<li>' +
										'<label for="amount">Amount</label>' +
										'<input class="sell amount" type="number" id="amount" name="amount" required="required" min="1" placeholder="0" step="1" /> ' +
									'</li>' +
								'</ol>' +
								'<ol class="shortcuts">' +
									'<li data-amount="10">+10</li>' +
									'<li data-amount="100">+100</li>' +
									'<li data-amount="all">All</li>' +
									'<li data-amount="-10">-10</li>' +
									'<li data-amount="-100">-100</li>' +
									'<li data-amount="0">0</li>' +
								'</ol>' +
								'<div class="control">' +
									'<input type="submit" class="button" id="submit" name="submit" value="Sell" />' +
								'</div>' +
							'</fieldset>' +
						'</form>');
				}
			});

			city.on('click', '.shortcuts li', function (ev) {
				var clicked = $(this),
					amount = clicked.data('amount'),
					available = $('#transaction').data('amount'),
					input = $('#transaction .amount');

				if (amount === 'all') {
					input.val(available);
				} else if (amount === 0) {
					input.val(0);
				} else {
					if (available >= (parseInt(input.val() || '0', 10) + amount)) {
						input.val(parseInt(input.val() || '0', 10) + amount);
					} else {
						input.val(available);
					}

					if (input.val() < 0) {
						input.val(0);
					}
				}

				r.updateTransactionValue();
			});

			city.on('input', '#transaction input', function (ev) {
				var clicked = $(this),
					available = $('#transaction').data('amount');

				if (parseInt(clicked.val() || '0', 10) > available) {
					clicked.val(available);
				}

				r.updateTransactionValue();
			});

			city.on('submit', '#transaction form', function (ev) {
				var transaction = $('#transaction');

				ev.preventDefault();

				if (transaction.find('.amount').hasClass('buy')) {
					Player.buyDrugs(transaction.data(), parseInt(transaction.find('.amount').val(), 10), function (result) {
						transaction.find('.error, .success').remove();
						if (result.error) {
							transaction.append('<p class="error">' + result.error + '</p>');
							if (result.helper) {
								transaction.append('<p class="error">' + result.helper + '</p>');
							}
						} else {
							transaction.append('<p class="success">' + result.success + '</p>');
							r.updateStreetContents(result.player.currentSector.street, result.player.drugs);
						}

						setTimeout(function () {
							transaction.find('.error, .success').fadeOut(300);
						}, 2000);
					});
				} else {
					Player.sellDrugs(transaction.data(), parseInt(transaction.find('.amount').val(), 10), function (result) {
						transaction.find('.error, .success').remove();
						if (result.error) {
							transaction.append('<p class="error">' + result.error + '</p>');
							if (result.helper) {
								transaction.append('<p class="error">' + result.helper + '</p>');
							}
						} else {
							transaction.append('<p class="success">' + result.success + '</p>');
							r.updateStreetContents(result.player.currentSector.street, result.player.drugs);
						}

						setTimeout(function () {
							transaction.find('.error, .success').fadeOut(300);
						}, 2000);
					});
				}
			});
		}
	}, u = {
		destroy: function () {
			$('#street').remove();
		},
		draw: function (player) {
			if (player) {
				r.fillStreetContents(player.currentSector.street, player.drugs);
			} else {
				Player.getPlayer(function (player) {
					r.fillStreetContents(player.currentSector.street, player.drugs);
				});
			}
		},
		initialize: function () {
			r.initDrugSelection();
		}
	};

	return u;
}());