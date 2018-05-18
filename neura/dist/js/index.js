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

		s.inputRot = 1.5;
		s.leftRot = 2;
		s.rightRot = 2;
		s.myRot = 0;
		s.rotStep = 0.01;

		s.beginPos;
		s.dogPos;
		s.rad = radius; // Circle radius

		s.stepVec;

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

		s.setup = function() {
			s.createCanvas(640, 240);

			s.angleMode(s.DEGREES);
			s.fill(255);
			s.stroke(51);
			s.strokeWeight(2);

			// Init vectors
			s.beginPos = s.getPathVector(s.rad / 2);
			s.dogPos = s.createVector(s.beginPos.x, s.beginPos.y);

			s.stepVec = s.createVector(2, 0);

			s.line1Pos = s.getPathVector(0);
			s.line2Pos = s.getPathVector(s.width);
		}

		s.draw = function() {
			if(options.turnRateSelector) {
				s.inputRot = parseFloat($(options.turnRateSelector).val());
			}

			s.background('#fff');

			s.line(s.line1Pos.x, s.line1Pos.y, s.line2Pos.x, s.line2Pos.y);

			s.rightRot = s.inputRot;
			s.leftRot = s.inputRot * -1;

			if(s.shouldRun) {
				// Move the dog around when it's on the screen and shouldRun
				if(s.dogPos.x < s.width + s.rad / 2) {
					s.hit = s.collideLineCircle(s.line1Pos.x, s.line1Pos.y, s.line2Pos.x, s.line2Pos.y, s.dogPos.x, s.dogPos.y, s.rad);
					s.dogPos.add(s.stepVec);

					s.onWhatSideOfLine = s.isAboveLine(s.line1Pos, s.line2Pos, s.dogPos);
					if(!s.hit && s.onWhatSideOfLine === 1) {
						if(s.myRot < s.rightRot) {
							s.myRot = s.lerp(s.myRot, s.rightRot, s.rotStep);
						}
					}
					else if(!s.hit && s.onWhatSideOfLine === -1) {
						if(s.myRot > s.leftRot) {
							s.myRot = s.lerp(s.myRot, s.leftRot, s.rotStep);
						}
					}
					else {
						s.timeOnPath++;
					}

					s.pathDist += Math.abs(s.dogPos.y - s.getPathVector(s.dogPos.x).y);

					s.dogPos.rotate(s.myRot);
				}
				// Reset the dog when off the screen
				else {
					s.toggleSimulation(false);
					s.resetSketch();

					if(options.shouldRunInfinitely) {
						console.log(s.pathDist + " | " + s.pathDistMax);
						if(s.pathDist < s.pathDistMax) {

						}

						if(options.infiniteCallback) {
							if(options.infiniteCallback.params) {
								options.infiniteCallback.func.apply(options.infiniteCallback, options.infiniteCallback.params);
							}
						}

						s.toggleSimulation(true);
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
			s.stroke(51, 100);
			for(let i = 0; i < s.myPoints.length; i++) {
				s.point(s.myPoints[i].x, s.myPoints[i].y);
			}
			s.fill(255);
			s.stroke(51);
			// Draw the dog
			s.ellipse(s.dogPos.x, s.dogPos.y, s.rad, s.rad);

			// Calculate direction line vectors
			s.tempPos = p5.Vector.add(s.dogPos, s.stepVec);
			s.tempPos.rotate(s.myRot);
			s.direction = p5.Vector.sub(s.tempPos, s.dogPos);
			s.direction.normalize();
			// Draw the direction line
			s.line(s.dogPos.x + (s.direction.x * (s.rad * 0.5)), s.dogPos.y + (s.direction.y * (s.rad * 0.5)), s.dogPos.x + (s.direction.x * (s.rad * 1)), s.dogPos.y + (s.direction.y * (s.rad * 1)));

			s.updateScore();
		}

		s.getPathVector = function(desiredX) {
			var thisY = s.m * desiredX + s.b;
			var desiredY = s.map(thisY, s.height, 0, 0, s.height);
			var thisVector = s.createVector(desiredX, desiredY);
			return thisVector;
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
				s.checkHighScore();
				playBtnElem.text('Release Neura');
			}
		}

		// Source: https://stackoverflow.com/questions/3838319/how-can-i-check-if-a-point-is-below-a-line-or-not
		s.isAboveLine = function(line1, line2, pointVec) {
			var v1 = s.createVector(line2.x - line1.x, line2.y - line1.y);
			var v2 = s.createVector(pointVec.x - line1.x, pointVec.y - line1.y);
			var crossProd = v1.x * v2.y - v1.y * v2.x;

			if(crossProd > 0) {
			    return -1;
			}
			else if(crossProd < 0) {
			    return 1;
			}
			else {
			    return 0;
			}
		}

		s.resetSketch = function() {
			s.dogPos.x = s.beginPos.x;
			s.dogPos.y = s.beginPos.y;
			s.myRot = 0;
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
		neuraSketches[thisSketchId].thisP5.toggleSimulation();
	});

	$('input[type="range"]').change(function(e) {
		var thisSketchId = $(this).siblings('.sketch-container').data('sketch-id');
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

		var dice = Math.random();
		if(dice > 0.5) {
			currAngle += tweakAngle;
		}
		else if(dice <= 0.5) {
			currAngle -= tweakAngle;
		}
		$(inputSelector).val(currAngle.toFixed(4));
	}
	else {
		console.error('No arguments given to randomizeTurningAngle');
	}
}