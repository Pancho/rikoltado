var Street = (function () {
	var r = {

	}, u = {
		destroy: function () {
			$('#street').remove();
		},
		draw: function () {
			var city = $('#city');
			Drugs.generateDrugState({}, function (pricelist) {
				console.log(pricelist);
			});
		}
	};

	return u;
}());