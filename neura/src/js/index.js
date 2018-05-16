// p5
var radius = 10;

var neuraSketches = [];

var NeuraSketch = function(userSpecifiedOptions) {
	// Defaults
	var options = {
        sketchDOMId: '',
        turnRateSelector: '',
        shouldRunInfinitely : false,
        infiniteCallback : {
        	func : null,
        	params : []
        },
        stopText : 'Return Neura'
    };

    for (var property in userSpecifiedOptions) { 
        options[property] = userSpecifiedOptions[property]; 
    }

	this.thisSketch = function(s) {
		s.sketchId = $('#' + options.sketchDOMId).data('sketchId');

		s.beginPos;
		s.dogPos;
		s.rad = radius; // Circle radius

		// The dog's path variables
		s.dogM = 0, s.dogB = 0;

		// Source for converting to p5 line(): 
		// https://forum.processing.org/one/topic/how-do-you-draw-a-simple-line-with-user-inputed-slope-and-intercept.html
		s.m = .2, s.b = 15;
		s.line1Pos;
		s.line2Pos;

		s.timeOnPath = 0;
		s.timeMax = 0;

		s.pathDist = 0;
		s.pathDistMax;

		s.shouldRun = false;

		s.myPoints = [];
		s.myPointTimer = 0;
		s.myPointTimerLength = 50;

		s.shouldTweakDirection = false;
		s.lastTweakDirection = 0;

		s.setup = function() {
			s.createCanvas(640, 240);

			s.angleMode(s.DEGREES);
			s.fill(255);
			s.stroke(51);
			s.strokeWeight(2);

			// Init vectors
			s.dogM = s.random(-1, 1);
			s.dogB = s.random(0 + s.rad, s.height - s.rad);

			s.beginPos = s.getDogVector(0);
			s.dogPos = s.createVector(s.beginPos.x, s.beginPos.y);

			s.line1Pos = s.getPathVector(0);
			s.line2Pos = s.getPathVector(s.width);
		}

		s.draw = function() {
			s.background('#fff');

			s.stroke('#333');
			s.strokeWeight(6);

			s.line(s.line1Pos.x, s.line1Pos.y, s.line2Pos.x, s.line2Pos.y);

			if(s.shouldRun) {
				// Move the dog around when it's on the screen and shouldRun
				if(!s.isCircleOutOfBounds(s.dogPos, s.rad)) {
					s.dogPos.x += 2;
					s.dogPos = s.getDogVector(s.dogPos.x);

					s.pathDist += Math.abs(s.dogPos.y - s.getPathVector(s.dogPos.x).y);
				}
				// Reset the dog when off the screen
				else {
					s.toggleSimulation();
					s.resetSketch();

					if(options.shouldRunInfinitely) {
						if(options.infiniteCallback) {
							if(options.infiniteCallback.params) {
								options.infiniteCallback.func.apply(options.infiniteCallback, options.infiniteCallback.params);
							}
						}

						s.toggleSimulation();
					}
				}

				// lasttime + time < now
				if(s.myPointTimer + s.myPointTimerLength < s.millis()) {
					if(s.myPoints.length > 500) {
						s.myPoints.shift();
					}
					s.myPoints.push(s.createVector(s.dogPos.x, s.dogPos.y));
					s.myPointTimer = s.millis();
				}
			}

			s.noFill();
			s.strokeWeight(2);
			for(let i = 0; i < s.myPoints.length; i++) {
				s.point(s.myPoints[i].x, s.myPoints[i].y);
			}
			s.fill('#333');
			s.stroke('#555');
			// Draw the dog
			s.ellipse(s.dogPos.x, s.dogPos.y, s.rad, s.rad);

			s.updateScore();
		}

		s.getPathVector = function(desiredX) {
			var thisY = s.m * desiredX + s.b;
			var desiredY = s.map(thisY, s.height, 0, 0, s.height);
			var thisVector = s.createVector(desiredX, desiredY);
			return thisVector;
		}

		s.getDogVector = function(desiredX) {
			var thisY = s.dogM * desiredX + s.dogB;
			var desiredY = s.map(thisY, s.height, 0, 0, s.height);
			var thisVector = s.createVector(desiredX, desiredY);
			return thisVector;
		}

		s.isCircleOutOfBounds = function(dogVector, radius) {
			var halfRad = radius / 2;

			var isOOB = (dogVector.x - halfRad > s.width || dogVector.x + halfRad < 0);
			isOOB = isOOB || (dogVector.y - halfRad > s.height || dogVector.y + halfRad < 0);
			return isOOB;
		}

		s.toggleSimulation = function(newState) {
			var playBtnElem = $('#' + options.sketchDOMId).siblings('.play-sketch');

			// Check for parameter
			if(newState !== undefined) {
				s.shouldRun = newState;
			}
			else {
				s.shouldRun = !s.shouldRun;
			}

			if(s.shouldRun) {
				s.myPointTimer = s.millis();

				s.pathDist = 0;
				playBtnElem.text(options.stopText);
			}
			else {
				s.resetSketch();
				// Only update high score if toggle was not manual
				if(newState === undefined) {
					s.checkHighScore();
				}
				playBtnElem.text('Release Neura');
			}
		}

		s.resetSketch = function() {
			s.dogM = s.random(-1, 1);
			s.dogB = s.random(0 + s.rad, s.height - s.rad);

			s.dogPos.x = s.beginPos.x;
			s.dogPos.y = s.getDogVector(s.beginPos.x).y;
		}

		s.updateScore = function() {
			var scoreElem = $('#' + options.sketchDOMId).siblings('.all-score-container');
			scoreElem.find('.score-container span').text(s.pathDist.toFixed(2));
		}

		s.checkHighScore = function() {
			var scoreElem = $('#' + options.sketchDOMId).siblings('.all-score-container');
			if(s.pathDist < s.pathDistMax || s.pathDistMax === undefined) {
				s.pathDistMax = s.pathDist;
				scoreElem.find('.highscore-container span').text(s.pathDist.toFixed(2));
				s.shouldTweakDirection = true;
			}
		}
	};

	this.thisP5 = new p5(this.thisSketch, options.sketchDOMId);
}

neuraSketches.push(new NeuraSketch({
		sketchDOMId : 'intro-sketch-holder'
	})
);
neuraSketches.push(new NeuraSketch({
		sketchDOMId : 'first-sketch-holder',
		turnRateSelector : '.page-1 .sketch-holder-range'
	})
);
neuraSketches.push(new NeuraSketch({
		sketchDOMId : 'second-sketch-holder',
		turnRateSelector : '.page-2 input.angle',
		shouldRunInfinitely : true,
		infiniteCallback : {
			func : randomizeTurningAngle,
			params : [
				'.page-2 input.angle'
			]
		},
		stopText : 'Stop Neura'
	})
);
neuraSketches.push(new NeuraSketch({
		sketchDOMId : 'third-sketch-holder',
		turnRateSelector : '.page-3 input.angle',
		shouldRunInfinitely : true,
		infiniteCallback : {
			func : randomizeTurningAngle,
			params : [
				'.page-3 input.angle',
				'.page-3 .sketch-holder-range'
			]
		},
		stopText : 'Stop Neura'
	})
);
neuraSketches.push(new NeuraSketch({
		sketchDOMId : 'fourth-sketch-holder',
		turnRateSelector : '.page-4 input.angle',
		shouldRunInfinitely : true,
		infiniteCallback : {
			func : randomizeTurningAngle,
			params : [
				'.page-4 input.angle',
				'.page-4 .sketch-holder-range'
			]
		},
		stopText : 'Stop Neura'
	})
);

var currentPage = 0;
// jQuery
$(document).ready(function() {
	$('.next-button').click(function(e) {
		e.preventDefault();
		$('.page-' + currentPage).removeClass('active');
		neuraSketches[currentPage].thisP5.toggleSimulation(false);
		currentPage++;
		$('.page-' + currentPage).addClass('active');
	});

	$('.previous-button').click(function(e) {
		e.preventDefault();
		$('.page-' + currentPage).removeClass('active');
		neuraSketches[currentPage].thisP5.toggleSimulation(false);
		currentPage--;
		$('.page-' + currentPage).addClass('active');
	});

	$('.play-sketch').click(function(e) {
		e.preventDefault();
		var thisSketchId = $(this).siblings('.sketch-container').data('sketch-id');
		var thisSketchP5 = neuraSketches[thisSketchId].thisP5;
		if(thisSketchP5.shouldRun) {
			neuraSketches[thisSketchId].thisP5.toggleSimulation(false);
		}
		else {
			neuraSketches[thisSketchId].thisP5.toggleSimulation();
		}
	});

	$('input[type="range"]').change(function(e) {
		var thisSketchId = $(this).parent().siblings('.sketch-container').data('sketch-id');
		neuraSketches[thisSketchId].thisP5.toggleSimulation(false);
	});

	setInterval(updateDOM, 50);
});

function updateDOM() {
	$('input[type="range"]').each(function(i) {
		var labelElem = $(this).siblings('span');
		labelElem.text($(this).val());
	})
}

function randomizeTurningAngle(...args) {
	var thisSketchId = $('section.active .sketch-container').data('sketch-id');
	var thisSketchP5 = neuraSketches[thisSketchId].thisP5;

	if(args) {
		var inputSelector = args[0];
		var tweakAngle = 0.01;
		if(args[1]) {
			tweakAngle = parseFloat($(args[1]).val());
		}

		if(!tweakAngle) {
			tweakAngle = 0.01;
		}
		var currAngle = parseFloat($(inputSelector).val());
		var tweakDirection = 1;

		if(thisSketchP5.shouldTweakDirection && thisSketchP5.lastTweakDirection !== 0) {
			$('.moving').text(tweakDirection);
			thisSketchP5.shouldTweakDirection = false;
			tweakDirection = thisSketchP5.lastTweakDirection;
		}
		else {
			var dice = Math.random();
			if(dice > 0.5) {
				tweakDirection = 1;
			}
			else if(dice <= 0.5) {
				tweakDirection = -1;
			}
		}
		currAngle += (tweakAngle * tweakDirection);
		thisSketchP5.lastTweakDirection = tweakDirection;

		$(inputSelector).val(currAngle.toFixed(4));
	}
	else {
		console.error('No arguments given to randomizeTurningAngle');
	}
}