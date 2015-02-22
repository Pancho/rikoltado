var Controls = (function () {
	var r = {
		x: 0,
		y: 0,
		characterImg: (function () {
			var img = new Image();
			img.src = 'http://worldwidewars.net/media/img/layout/screenshot-1.png?v=0';
			return img;
		}()),
		initMovement: function () {
			Engine.persist({
				x: r.x,
				y: r.y,
				img: r.characterImg
			});

			$(document).on('keydown', function (ev) {
				console.log(ev);

				if (ev.keyCode === 87) { // w
					r.y -= 1;
				} else if (ev.keyCode === 83) { // s
					r.y += 1;
				} else if (ev.keyCode === 65) { // a
					r.x -= 1;
				} else if (ev.keyCode === 68) { // d
					r.x += 1;
				}
			});
		}
	}, u = {
		initialize: function () {
			r.initMovement();
			DB.onReady(function () {

			});
		}
	};

	return u;
}());

$(Controls.initialize);