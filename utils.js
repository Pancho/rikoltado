var Utils = (function () {
	var r = {
		getFieldAttributes: function (field) {
			var result = '';

			$.each(field.attributes, function (i, attribute) {
				if (attribute) {
					result += attribute.key + '="' + attribute.value + '" ';
				}
			});

			return result;
		}
	}, u = {
		capitalize: function (string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
		months: [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		],
		toPrettyDate: function (date, precise) {
			var year = date.getFullYear(),
				month  = Utils.months[date.getMonth()],
				day = date.getDate(),
				hour = date.getHours(),
				minute = date.getMinutes();

			if (precise) {
				return day + ' ' + month + ' ' + year + ' (' + hour + ':' + minute + ')';
			} else {
				return day + ' ' + month + ' ' + year;
			}
		},
		toHourMinute: function (date) {
			var hour = date.getHours(),
				minute = date.getMinutes();

			return hour + ':' + minute;
		},
		fromPrettyDate: function (string) {

		},
		getDayStart: function (date) {
			var start = new Date(date);
			start.setHours(0,0,0,0);

			return start;
		},
		getDayEnd: function (date) {
			var end = new Date(date);
			end.setHours(23,59,59,999);

			return end;
		},
		getDateRangeList: function (start, end) {
			var result = [],
				currentDate = null;

			start = Utils.getDayStart(start);
			end = Utils.getDayStart(end);

			currentDate = new Date(start);

			while (currentDate <= end) {
				result.push(new Date(currentDate));
				currentDate.setDate(currentDate.getDate() + 1);
			}

			return result;
		},
		getMonday: function (date) {
			date = new Date(date);
			var day = date.getDay(),
				diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
			return new Date(date.setDate(diff));
		},
		getMonthStart: function (date) {
			date = new Date(date);
			return new Date(date.setDate(1));
		},
		getYearStart: function (date) {
			date = new Date(date);
			return new Date(date.setMonth(0));
		},
		randomFromRange: function (min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		randomSign: function () {
			return Math.random() < 0.5 ? -1 : 1
		},
		randomChoice: function (list) {
			return list[Math.floor(Math.random() * list.length)];
		},
		dimScreen: function () {
			var body = $('body'),
				doc = $(document),
				win = $(window),
				lightbox = $('<div class="lightbox"></div>');

			lightbox.on('click', function () {
				Utils.cleanScreen();
			});
			$(document).on('keyup.boxClose', function (ev) {
				if (ev.keyCode === 27) {
					Utils.cleanScreen();
				}
			});

			body.append(lightbox);
			lightbox.css('height', win.height());
			lightbox.css('width', win.width());
			lightbox.on('click', Utils.cleanScreen);
		},
		cleanScreen: function () {
			$('.lightbox, .lightbox-box').remove();
			$(document).off('keyup.boxClose');
		},
		showPopup: function (contents, callbacks) {

		},
		getForm: function (config) {
			var form = $('<form action="' + (config.action || '') + '" method="' + (config.method || 'get') + '" class="' + config.formClass + '" id="' + config.id + '"></form>'),
				fieldset = $('<fieldset></fieldset>'),
				legend = $('<legend>' + config.legend + '</legend>'),
				fieldList = $('<ol></ol>'),
				control = $('<div class="control"><input type="submit" class="submit" id="submit" name="submit" value="' + (config.control.submitValue || 'Submit') + '" />' + (config.control.additional || '') + '</div>');

			$.each(config.fields, function (i, field) {
				var listItem = $('<li></li>');

				if (field.elm === 'input') {
					listItem.append('<label for="' + field.id + '">' + field.label + '</label><input type="' + field.fieldType + '" name="' + field.name + '" id="' + field.id + '" ' + r.getFieldAttributes(field) + '/>');
				} else if (field.elm === 'select') {

				} else if (field.elm === 'textarea') {

				}
			});

			form.append(fieldset);
			fieldset.append(legend);
			fieldset.append(fieldList);
			fieldset.append(control);

			console.log($('<div></div>').append(form).html());

			return form;
		}
	};

	return u;
}());

$(Utils.initialize);