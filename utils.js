var Utils = {
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
		return Math.round(Math.random() * (max - min) + min);
	},
	randomSign: function () {
		return Math.random() < 0.5 ? -1 : 1
	}
};