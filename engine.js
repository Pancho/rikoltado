var Engine = (function () {
	var r = {
		stopped: false,
		canvas: null,
		animationFrame: 0,
		persistent: [],
		frameQueue: [],
		initialized: false,
		resizeCanvas: function () {
			r.canvas.height = window.innerHeight;
			r.canvas.width = window.innerWidth;
		},
		initResize: function () {
			r.resizeCanvas();
			$(window).on('resize', r.resizeCanvas);
		},
		/*
		Draw single object
		 */
		draw: function (obj) {
			r.context.drawImage(obj.img, obj.x, obj.y);
		}
	}, u = {
		persist: function (obj) {
			r.persistent.push(obj);
		},
		/*
		 Create a queue for the drawing of the frame. Elements will be painted in specified order.
		 With this one can achieve the z-index, which would otherwise be elusive

		 Use concat in case you have predefined list of objects (map, menus etc... those that don't need constant updating)
		 */
		queue: function (obj, concat) {
			if (concat) {
				r.frameQueue.concat(obj);
			} else {
				r.frameQueue.push(obj);
			}
		},
		animate: function (timestamp) {
			if (r.stopped) {
				return;
			}

			// Clear everything
			r.context.clearRect(0, 0, r.canvas.width, r.canvas.height);
			// Draw the elements on queue
			$.each(r.frameQueue, function (i, obj) {
				r.draw(obj);
			});
			// Clear queue for the next frame
			r.frameQueue = r.persistent.slice();
			// Once done with this frame, request next
			r.animationFrame = window.requestAnimationFrame(u.animate);
			//console.log('Frame: ', r.animationFrame);
		},
		show: function () {
			//console.log('Running show.');

			$('#game-canvas').show();
			r.stopped = false;
			u.animate();
		},
		hide: function () {
			//console.log('Running hide.');

			$('#game-canvas').hide();
			r.stopped = true;
			if (r.animationFrame) {
				window.cancelAnimationFrame(r.animationFrame);
			}
		},
		destroy: function () {
			//console.log('Running destroy on Engine.');

			if (!r.initialized) {
				//console.log('Engine not yet initialized. Aborting.');
				return;
			}
			if (r.animationFrame) {
				window.cancelAnimationFrame(r.animationFrame);
			}

			r.stopped = true;
			r.initialized = false;
			$('#game-canvas').remove();
		},
		initialize: function (config) {
			//console.log('Initializing Engine.');

			// Initialize once
			if (r.initialized) {
				//console.log('Engine already initialized. Aborting.');
				return;
			}

			config = config || {};

			$('body').append('<canvas id="game-canvas"></canvas>');

			r.canvas = document.getElementById('game-canvas');
			r.context = r.canvas.getContext('2d');

			if (config.initHidden) {
				u.hide(); // When only initialized, you don't want it to show. That has to be requested manually.
			}

			// Init resizing
			r.initResize();

			// Initialized
			r.initialized = true;
			r.stopped = false;
		}
	};

	return u;
}());