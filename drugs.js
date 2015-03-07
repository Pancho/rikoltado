var Drugs = (function () {
	var r = {
		cache: {},
		buildRange: function (min, max, step) {
			var x = min,
				cacheKey = min + '|' + max + '|' + step || .001;

			step = step || .1;

			if (!r.cache[cacheKey]) {
				r.cache[cacheKey] = [];
				while (x <= max) {
					r.cache[cacheKey].push(x);
					x += step;
				}
			}
			return r.cache[cacheKey];
		}
	}, u = {
		generateDrugState: function (promises, callback) {
			DB.drugs.all(function (drugs) {
				var result = [];

				$.each(drugs, function (i, drug) {
					var blob = {
						name: drug.name,
						price: (promises.priceMultiplier || 1) * Math.round(Utils.randomChoice(r.buildRange(drug.minPrice, drug.maxPrice)) * 100) / 100,
						amount: Utils.randomFromRange(0, Utils.randomFromRange(0, 1000)),
						unit: drug.unit,
						unitPlural: drug.unitPlural
					};

					result.push(blob);
				});

				callback(result);
			});
		}
	};

	return u;
}());