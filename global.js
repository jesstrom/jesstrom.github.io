$(document).ready(function() {
	bindUnder();
	doCarousel();
})

var isWebkit = 'WebkitAppearance' in document.documentElement.style
if (isWebkit) { $("html").addClass('webkit');};
var touch = false;
if (Modernizr.touchevents || Modernizr.touch) {
	touch = true;
	$("html").addClass('touch')
} else {
	$("html").addClass('no-touch')
}



$(window).load(function() {
	// $("#projects").isotope({
	// 	masonry: {
	// 		columnWidth: '.project-sizer'
	// 	},
	// 	itemSelector: '.project',
	// });
	//upperPosition();
	infoHeights();
	doWave();

	// scroll site to center
	setTimeout(function() {
		var newleft = ($('#projects').width() - $(window).width())/2
		$('body').scrollLeft(newleft);
		$("#projects").delay(200).fadeTo('500', '1');
		$("#upper").fadeTo('300', '1');

	}, 10)

})

var resizeTimeout;
$(window).resize(function() {
	clearTimeout(resizeTimeout)
	resizeTimeout = setTimeout(function() {
		infoHeights();
	//	$("#projects").isotope();
	}, 300)
})


// Info dropdown functionality

$(window).load(function() {
	infoHeights();
	bindPanelButtons();
});
$(window).resize(function() {
	infoHeights();
});


function infoHeights(panel) {
	var max_height = window.innerHeight;
	if (!panel) {
		panel = $(".info-panel");
	}
	panel.each(function() {
		$(this).removeAttr('style').addClass('init');
		var height = $(this).outerHeight(true);
		 // height = (height > max_height) ? height = max_height : height = height;
		if (height > max_height) {
		//	height = max_height;
		//	$(this).addClass('max');
		}  else {
		//	height = height;
		//	$(this).removeClass('max');
		}
		$(this).attr('data-height', height).removeClass('init');
	})	
}

function openPanel(id) {
	$('body').addClass('info-view');
	var panel = $("#" + id);
	var newHeight = panel.attr('data-height');
	panel.animate({
		'height': newHeight,
	}, 400, function() {
		panel.addClass('visible');
	});
	var closer = panel.find('.panel-closer');
	// $("#info-overlay").click(function() {
	// 	alert('over');
	// 	closepanel();
	// });
	closer.click(function() {
		closepanel();
	})
	function closepanel() {
		$('body').removeClass('info-view');
		panel.removeClass('visible');
		setTimeout(function() {
		//	$(this).unbind();
			panel.animate({
				'height': 0,
			}, 400)
		}, 100)

		$("#info-overlay").unbind('click');
		closer.unbind('click');
	}
}





function bindPanelButtons() {
	$(".info-link").each(function() {
		$(this).unbind();
		$(this).click(function() {
			id = $(this).attr('data-info');
			openPanel(id);
		})
	})
	$("body").keydown(function(e) {
		if (e.keyCode == 27) $('#under').click();   // esc
		if (e.keyCode == 37) $('.left-arrow').click();   // left
		if (e.keyCode == 39) $('.right-arrow').click();   // right
	});
}


$("#overlay").click(function() {
	$(".info-page").removeClass('visible');
	$("#info").css('height', '0');
	changeView('main-view');
})




/// Keep header in place

// if ($("#header").css('position') == "fixed") {
// 	$(window).scroll(function() {
// 		upperPosition();
// 	})
// 	function upperPosition() {
// 		windowTop = $(window).scrollTop() * -1;
// 		$("#header").css('top', windowTop);
// 	}
// }



// header links

$(".info-link").click(function() {
	changeView('info-view');
	info_link = "#" + $(this).attr('data-info');
	newHeight = $(info_link).attr('data-height') + "px";
	$("#info").css('height', newHeight);
	$(".info-page").removeClass('visible');
	$(info_link).addClass('visible');
})

$("#projects-button").click(function() {
	$("#project-filters").toggleClass('visible');
})


$(".filter").click(function() {
	filter = $(this).attr('data-filter');
	$("#projects").css('opacity', 0);
	setTimeout(function() {
		$(".project.hidden").removeClass('hidden');
		$(".project").not('.'+filter).addClass('hidden');
		setTimeout(function () {
			$("#projects").css('opacity', 1);
		}, 100)
	}, 300)
	// $("#projects").fadeTo('200', 0, function () {
	// 		$("#projects").fadeIn();

	// 	// setTimeout(function() {
	// 	// }, 250)
	// })

	filter = $(this).attr('data-filter');
	// $("#projects").isotope({
	// 	filter: "." + filter,
	// 	masonry: {
	// 		columnWidth: '.project-sizer'
	// 	},
	// 	itemSelector: '.project',
	// });
})



// AJAX, project loading, transitions

function changeView(view) {
	$("body").removeClass().addClass(view);
}

// $(".project-inner").bind('mouseenter', function() {
// 	$('.project-inner').removeClass('hover');
// //	$(this).addClass('hover');
// }).bind('mouseleave', function() {
// 	$(this).removeClass('hover')
// })


// $(".project-inner").bind('click', function() {
// 	if ($(this).hasClass('hover')) {
// 		link = $(this).attr('data-project');
// 		doAjax(link);
// 	} else {
// 		$('.project-inner').removeClass('hover');
// 		$(this).addClass('hover');
// 	}
// })


$(".project-inner").click(function(e) {
	link = $(this).attr('data-project');
	doAjax(link);
})

function doAjax(link) {
	rootstring = window.location.origin;
	loadUrl = link + " #projectPage";
	newurl = link.replace(rootstring,'');
	history.pushState({}, "page 2", newurl);
	$("#loadProject").addClass('load').load(loadUrl, function() {
		bindUnder();
		changeView('project-view');
		doCarousel();
	//	doslick();
		$("#loadProject").scrollTop(0);
		infoHeights($(this).find('.info-panel'));
		bindPanelButtons();
	});
	 $(window).on('popstate', function() {
	 	changeView('project-view');
    });
}

function bindUnder() {
	$("#under").click(function() {
		changeView('main-view');
		history.pushState({id:"Home"}, "home", "/");
	})	
}


function doCarousel() {
	embedHeights();
	active = $("#project-images").children('.project-image-container').first();
	active.addClass('active');
	$(".right-arrow").click(function() {
		active.removeClass('active');
		if (active.is(":last-child")) {
			active = active.siblings('.project-image-container').first();
		} else {
			active = active.nextAll('.project-image-container').first();
		}
		active.addClass('active');
	})
	$(".left-arrow").click(function() {
		active.removeClass('active');
		if (active.is(":first-child")) {
			active = active.siblings('.project-image-container').last();
		} else {
			active = active.prevAll('.project-image-container').first();
		}
		active.addClass('active');
	})
}

function findPrevNext(element) {
	var current = {};
	current.next = element.siblings('project-image-container').next();
	current.prev = element.siblings('project-image-container').prev();
	return current;
}

function embedHeights() {
	// calculate correct widths & heights for embeds & firefox fix
	$(".embed").each(function() {
		var container_height = Math.floor($(this).innerHeight());
		var container_width = Math.floor($(this).innerWidth());
		var embed = $(this).children('.video').first();
		var ratio = embed.height() / embed.width();
		if ((container_height * (1 / ratio)) > container_width) {
			embed.height((container_width * (ratio)) - 1).width("99%");
		} else {
			embed.height("99%").width((container_height * (1 / ratio)) -1)
		}
		setTimeout(function() {
			embed.fadeTo('300', '1');
		}, 200);

	})
}


// Waving text

var wave = {};

function doWave() {
	wave.basespeed = 3000;
	wave.hoverspeed = 1;
	wave.speed = wave.basespeed;
	wave.speed = 3000;
	wave.baseamplitude = 10;
	wave.splash = 0;
	wave.amplitude = wave.baseamplitude;
	wave.frequency = 175;
	wave.timer = 0;
	//wave.degrees = 18;

	$(".wave").each(function() {
		$(this).css({
			'width': $(this).width(),
			'height': $(this).height(),
		});
		// split into letters with spans
		$(this).attr('data-original-text', $(this).text());
		var text = $(this).text().split("");
		$(this).empty();
		for (i = 0; i < text.length; i++) {
			var charnum = i+1;
			var add_class = "";
			if (text[i] == " ") {add_class = " space "; };
			var newchar = "<span class='wave-char char" + charnum + add_class + "'><div class='wave-char-container'>" + text[i] + "</div></span>";
			$(this).append(newchar);
		}
		// cache all letters
		var letters = [];
		var wave_width = $(this).width();
		$(".wave-char").each(function() {
			var leftpos = Math.floor($(this).position().left) + 1;
			$(this).attr({
				'data-left': (leftpos - (wave_width * 0.5)),
				'data-rando': Math.round(Math.random() * 3) + 2,
			}).css({
				'left': leftpos,
			});
			letters.push($(this));
		})
		$(".wave-char").css('position', 'absolute');
		// animate each letter
		

		// start timer

		var timer;
		timer = setInterval(function() {
			wave.timer = wave.timer + 10;
			if (wave.timer > wave.basespeed) {
				wave.timer = 0
			}
		},10)


		// render function
		var twopi = 2 * 3.14159;
		function render() {
			var speed = wave.speed * wave.hoverspeed;
			var position = ((wave.timer - wave.basespeed) % speed) / speed;
			for (var i = 0; i < letters.length; i++) {
				//var freq_shift = ((wave.frequency % letters[i].attr('data-left'))/wave.frequency) * .9;
				var letter_left = letters[i].attr('data-left');
				var freq_shift = (letter_left / wave.frequency) + (wave.splash * letters[i].attr('data-rando'));
				var new_y = Math.sin(twopi * (position + freq_shift));
				var new_skew = Math.sin(twopi * (position + freq_shift) + ( twopi * .25 )) * (wave.degrees * ((wave.splash * 2) + 1));
				var y_intensity = 50;  // was 50
				var translate_y = new_y * (wave.amplitude * ((wave.splash * y_intensity) + 1));
				var x_intensity = 3; // was 3
				var translate_x = wave.splash * letter_left * x_intensity; 
				letters[i].css({
					'transform' : "translateY(" + translate_y + "px) translateX(" + translate_x + "px) skewY(" + new_skew + "deg)",
				})
			};
		}	

		function animationLoop() {
			render();
			requestAnimationFrame(animationLoop);
		}
		animationLoop();
		var amp_int;
		var speed_int;
	
		var splash_interval;

		var name = "easeOutElastic";
		$("#header-logo").bind('click', function() {
			$("#confetti-container").addClass('visible');
			setTimeout(function() {
			//	$("#confetti-container").removeClass('visible');
			//}, 15000)
			//clearInterval(splash_interval);
			//wave.splash = 0;
			//var splash_timer = 0;
			//var splash_duration = 6000 * .1; // milliseconds, in tenths for our 10ms interval
			//var splash_limit = 1;
			//splash_interval = setInterval(function() {

				// t = current time 	= start at 0
				// b = start value 		= splash.limit
				// c = change value 	= -1
				// d = duration			= in 10 milliseconds (100 = 1 second)
				//eval("wave.splash = $.easing." + name + "(null, splash_timer, splash_limit, -1, splash_duration)");

				// wave.splash = $.easing.easeInCirc(
				// 	null,
				// 	splash_timer,
				// 	splash_limit,
				// 	-1,
				// 	splash_duration)


				//splash_timer++;
				//if (splash_timer >= splash_duration) {
					//clearInterval(splash_interval);
				//}
			}, 10)
		})
		$(".easing-function").click(function(){
			easing_function = $(this).html();
			name = easing_function;
			$(".easing-function").removeClass('selected');
			$(this).addClass('selected');
			$("#header-logo").click();
		})
		$("#close").click(function(){
			$("#debug").remove();
		})

		var site_color = tinycolor($(".sitecolor").css('color'));
		var h = site_color.toHsl().h;
		var s = site_color.toHsl().s;
		var l = site_color.toHsl().l;

		if (!touch) {
			$(".wave-char-container").each(function() {
				var on;
				var duration = 1000;
				var maxout = duration;
		//		var letter_hue = h;
		//		var add_hue = .5;
				var rotation = 360;
				var add_rotation = .5;
				var trans_timer = 0;
				$(this).on('mouseenter', function(){ 
					$(this).addClass('hover')
					on = true;
					var letter = $(this);
					animate();
					function animate() {
						var animateInterval = setInterval(function(){
							// letter_hue = ((letter_hue + 360) % 360) + add_hue;
							// var color_string = 'hsl(' + letter_hue + ', ' + s*100 + '%, ' + l*100 +'%)';
							// letter.css({
							// 	'color': color_string
							// })



							rotation = ((rotation + add_rotation) % 360);
							var rot_frac = (rotation / 360);

						//	abs function
							var sat_func = (-Math.abs(2 * (rot_frac + .5) - 2)) + 1;
							var saturation = (sat_func * 2.5) + 1;

							// square function
					//		var frac_pow = Math.pow((rot_frac - .5), 2);
					//		var saturation = (((frac_pow * -4) + 1) * 7) + 1;
					

							var do_rotate = "hue-rotate(" + rotation + "deg)";
							var do_rotate = "hue-rotate(" + rotation + "deg) saturate(" + saturation + ")";
							letter.css({
								'filter': do_rotate,
								'-webkit-filter': do_rotate,
							})
							trans_timer = trans_timer + 10;
							if (trans_timer >= maxout) {
									if (maxout > duration) {
										maxout = duration;
									}
									clearInterval(animateInterval);
								if (on) {
									animate();
									trans_timer = 0;
								} else {
									trans_timer = 0;
								}
							}
						}, 10)
					}

				}).on('mouseleave', function() {
					$(this).removeClass('hover');
					maxout = trans_timer + 1000;
					on = false;
				})				
			})
		}
	})
}



// old hue with easing (not necessary)

	// var onInterval = setInterval(function() {
	// 	if (on) {
	// 		var rotation = letter.attr('data-hue-rotation')
	// 		console.log(rotation);
	// 		var new_rotation = rotation + add_rotation;
	// 	//	letter.attr('data-hue-rotation', new_rotation);
	// 		var trans_timer = 0;
	// 		var splash_interval = setInterval(function() {

	// 			// t = current time 	= start at 0
	// 			// b = start value 		= splash.limit
	// 			// c = change value 	= -1
	// 			// d = duration			= in 10 milliseconds (100 = 1 second)
	// 			var animate_rotate = $.easing.easeOutCirc(null, trans_timer, rotation, add_rotation, (duration / 10))
	// 			var do_rotate = 'hue-rotate(' + Math.floor(animate_rotate) + 'deg)';
	// 		//	console.log(trans_timer + " :: " + rotation + " // " + new_rotation + " == " + do_rotate);

	// 			letter.css({
	// 				'-webkit-filter': do_rotate,
	// 			})

	// 			// wave.splash = $.easing.easeInCirc(
	// 			// 	null,
	// 			// 	splash_timer,
	// 			// 	splash_limit,
	// 			// 	-1,
	// 			// 	splash_duration)

	// 			trans_timer++;
	// 			if (trans_timer >= (duration / 10)) {
	// 				console.log('-----------');
	// 				clearInterval(splash_interval);
	// 				letter.removeClass('shifting');
	// 			}
	// 		}, 10)						
	// 	};
	// }, duration);		



