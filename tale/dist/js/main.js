// jQuery
var myRand = new Math.seedrandom('hello');
var trueMagic = -1;
var guessMagic = -1;

var testImgNameArrays = [];
var trainImgNameArrays = [];
var numberObjs = [];
var activeNumObj = {};
var sortCount = 0;
var maxSortCount = -1;
var numObjCount = 0;

var myP5 = new p5();

var progressTimer;
var learningTimer;
var learningTimerKillswitch;

var augustaOffsetHistory = [];
var augustaOffset = 0;

var learningRate = 7;

var oldMax = 0;

// What jQuery elem are we dragging?
var draggee;

var singleNumberElem = '<div class="single-number shadow rounded" draggable="true"><img src=""></div>';

$(document).ready(function() {
	fetchImgNames().then(function(response) {
		testImgNameArrays = response[0];
		for(let i = 0; i < testImgNameArrays.length; i++) {
			for(let numSrc of testImgNameArrays[i]) {
				numberObjs.push(
					{
						'numberId' : i,
						'src' : numSrc,
						'path' : '/dist/img/test/' + i + '/' + numSrc,
						'playerLabel' : -1,
						'networkGuess' : -1
					}
				);
			}
		}

		trainImgNameArrays = response[1];
		for(let i = 0; i < trainImgNameArrays.length; i++) {
			for(let numSrc of trainImgNameArrays[i]) {
				numberObjs.push(
					{
						'numberId' : i,
						'src' : numSrc,
						'path' : '/dist/img/training/' + i + '/' + numSrc,
						'playerLabel' : -1,
						'networkGuess' : -1
					}
				);
			}
		}

		numberObjs = shuffle(numberObjs);
	})
	.catch(function(err) {
		console.log('FetchImgNames Error :-S', err);
	});

	/*$(window).keydown(function(e) {
		var newSort = parseInt(e.originalEvent.key)
		if(e.originalEvent.key === 'n') {
			runCurrentTask();
		}
		if(e.originalEvent.key === 'a') {
			$('.answer-option').first().trigger('click');
		}
		if(e.originalEvent.key === 'c') {
			$('.single-number').detach().appendTo($('.sorter .number-container').first());
			if(isSorterFilled()) {
				runCurrentTask();
			}
		}
		if(e.originalEvent.key === 'g') {
			$('.augusta-button .btn').trigger('click');
		}
		if(e.originalEvent.key === 'h') {
			$('.intro-overlay-interface').toggleClass('hidden');
		}
		if(e.originalEvent.key === 's') {
			$('.intro-overlay-interface .btn').trigger('click');
		}
	})*/

	$('.full-overlay .btn').click(function(e) {
		if(!$(this).parent().hasClass('hidden')) {
			$(this).parent().fadeOut(300, function() {
				$(this).addClass('hidden');
				if($(this).hasClass('intro-overlay-interface')) {
					startChat();
				}
			});
		}
	})

	$('.augusta-reset').click(function() {
		if($('#app').data('currentStep') === 0) {
			$('#app').data('currentStep', 1);
		}
		resetImages();
	})

	$('.augusta-learn').click(function() {
		if(!isPendingEmpty() && !$('.btn').hasClass('step-6')) {
			learningTimer = setInterval(function() {
				// Make sure timeout only runs once
				clearTimeout(learningTimerKillswitch);

				if(!$('#app').hasClass('is-learning')) {
					$('#app').addClass('is-learning');
					$('#augusta-range').prop('disabled', true);
					$('.btn').css('pointer-events', 'none').addClass('disabled');
					$('.augusta-learn i').addClass('fa-spin');
				}

				if(!isMagicCloseEnough()) {
					resetImages();
					learnMagicNumber();
				}

				if(isMagicCloseEnough()) {
					clearInterval(learningTimer);

					learningTimerKillswitch = setTimeout(function() {
						augustaOffset = 0;
						calculateAugustaOffset();

						$('#app').removeClass('is-learning');
						$('#augusta-range').prop('disabled', false);
						$('.btn').css('pointer-events', 'auto').removeClass('disabled');
						$('.augusta-learn i').removeClass('fa-spin');

						runCurrentTask();
					}, 500);
				}
			}, 500);
		}
	});

	setInterval(updateGUI, 50);
});

function updateGUI() {
	$('label').each(function() {
		var myRange = $(this).siblings('input[type="range"]');
		var myVal = myRange.val();
		var myMax = parseInt(myRange.attr('max'));
		var myLeft = ((myVal - 1) / myMax) * 100;
		if($('#app').hasClass('sandbox')) {
			$(this).text(myVal + ' / ' + myMax);
		}
		else {
			$(this).text(myVal);
		}
	});
}

function initNumberListeners() {
	$('.sorter').off('dragenter');
	$('.sorter').off('dragover');
	$('.sorter, .pending').off('drop');
	
	$('.single-number').off('dragstart');

	$('.sorter, .pending').on('dragenter', dragenter);
	$('.sorter, .pending').on('dragover', dragover);
	$('.sorter, .pending').on('drop', pendingSortDrop);
	
	$('.single-number').on('dragstart', dragstart);

	$('.single-number').on('click', function(e) {
		var firstInLine = $(this).siblings('.single-number').first();
		$(this).insertBefore(firstInLine);
	})
}

function dragstart(e) {
	// e.preventDefault();
	// console.log($(e.target));
	draggee = $(e.target);
}

function dragover(e) {
	e.preventDefault();
	e.stopPropagation();
	// console.log(e);
}

function dragenter(e) {
	e.preventDefault();
	e.stopPropagation();
	// console.log(e);
}

function pendingSortDrop(e) {
	e.preventDefault();
	e.stopPropagation();
	// console.log(e);

	var newCont = $(this).find('.number-container');
	if(newCont.parent().hasClass('sorter')) {
		if(isSorterFilled()) {
			runCurrentTask();
		}
	}

	drop(newCont);
}

function drop(newCont) {
	draggee.parent().detach().appendTo(newCont);
}

function isPendingEmpty() {
	if($('.pending .single-number').length < 1) {
		return true;
	}
	else {
		return false;
	}
}

function isSorterFilled() {
	if($('.sorter .single-number').length >= maxSortCount - 1) {
		return true;
	}
	else {
		return false;
	}
}

function runCurrentTask() {
	if(currentTask !== undefined) {
		currentTask();
		currentTask = undefined;
	}
}

function addImagesToPending(numCount) {
	if(numObjCount < 70000 - numCount) {
		for(var i = 0; i < numCount; i++) {
			var thisNumObj = numberObjs[numObjCount];
			var thisElem = $(singleNumberElem).clone();
			thisElem.prependTo('.pending .number-container').find('img').attr('src', thisNumObj.path).data('arrayId', numObjCount);
			numObjCount++;
		}

		maxSortCount = numObjCount;

		if(oldMax !== 0) {
			remapMagic(oldMax, maxSortCount);
		}
		oldMax = maxSortCount;

		$('.augusta-range input').attr('max', maxSortCount);

		initNumberListeners();
	}
	else {
		alert('What??? You went through all 70000 numbers? Daaamn. You should send me a screenshot of this on my Twitter @jepster_dk!');
	}
}

function resetImages() {
	var thisArr = shuffle($('.single-number'));
	thisArr.appendTo('.pending .number-container');
}

function updateGuessListeners() {
	$('.augusta-button .btn').off('click');

	$('.augusta-button.step-1 .btn').on('click', function() {
		// Move the numbers about randomly
		$('.pending .single-number').each(function() {
			var rnd = getRandom(0, 9);
			$(this).detach().prependTo($('.sorter .number-container')[rnd]);
		})

		if(isSorterFilled()) {
			augustaOffset = 0;
			calculateAugustaOffset();
			replaceSectionPhrase(8, /\$\$\$/, augustaOffset);
			runCurrentTask();
		}
	});

	$('.augusta-button.step-2 .btn').on('click', function() {
		// Cheat the player by setting magic number to something other than what they guessed
		// but only if they have added all numbers to augusta
		if(!isPendingEmpty()) {
			guessMagic = parseInt($('.augusta-range input').val());

			if(guessMagic < 5) {
				trueMagic = getRandom(6, 11);
			}
			else {
				trueMagic = getRandom(1, 5);
			}

			runMagicGuess();

			// Wait a while for dramatic effect
			setTimeout(function() {
				augustaOffset = 0;
				calculateAugustaOffset();

				// Update text according to augusta offset
				replaceSectionPhrase(13, /\$\$\$/, augustaOffset);

				var augustaChats = ["actually worse than before", "as bad as before", "perfect! But I think we only got REALLY close to the right weight", "better than before"];
				var chosenChat = "";
				if(augustaOffset > augustaOffsetHistory[0]) {
					chosenChat = augustaChats[0];
				}
				else if(augustaOffset === augustaOffsetHistory[0]) {
					chosenChat = augustaChats[1];
				}
				else if(augustaOffset === 0) {
					chosenChat = augustaChats[2];
				}
				else if(augustaOffset < augustaOffsetHistory[0]) {
					chosenChat = augustaChats[3];
				}
				replaceSectionPhrase(13, /\$asBadAs/, chosenChat);

				runCurrentTask();
			}, 500);
		}
	});

	$('.augusta-button.step-3 .btn').on('click', function() {
		if(!isPendingEmpty()) {
			guessMagic = parseInt($('.augusta-range input').val());
			runMagicGuess();

			augustaOffset = 0;
			calculateAugustaOffset();

			if(augustaOffset !== 0 && !haveRemindedOfMagic) {
				var increase = ["increase", "decrease"];
				var chosenChat = "";
				if(guessMagic < trueMagic) {
					chosenChat = increase[0];
				}
				else {
					chosenChat = increase[1];
				}
				var thisConv = JSON.parse(JSON.stringify(findMagicNumberConv));
				thisConv = replaceThisPhrase(thisConv, /\$increase/, chosenChat);
				insertQuestion(thisConv);
				haveRemindedOfMagic = true;
			}
			
			if(augustaOffset === 0) {
				// Wait a while for dramatic effect
				setTimeout(function() {
					replaceSectionPhrase(17, /\$\$\$/, augustaOffset);

					runCurrentTask();
				}, 500);
			}
		}
	});

	$('.augusta-button.step-4 .btn').on('click', function() {
		if(!isPendingEmpty()) {
			guessMagic = parseInt($('.augusta-range input').val());
			runMagicGuess();

			// Wait a while for dramatic effect
			setTimeout(function() {
				augustaOffset = 0;
				calculateAugustaOffset();

				var chats = [
					"Oh no, that didn't go well. Now she is off by $$$...",
					"That went reasonably well. She was only off by $$$...",
					"No wrong guesses! That was perfect! However, I think we might have gotten lucky this time."
				];
				var chosenChat = "";
				if(augustaOffset > 5) {
					chosenChat = chats[0];
				}
				else if(augustaOffset > 0) {
					chosenChat = chats[1];
				}
				else if(augustaOffset === 0) {
					chosenChat = chats[2];
				}

				replaceSectionPhrase(19, /\$replacer/, chosenChat);
				replaceSectionPhrase(19, /\$\$/, augustaOffset);

				runCurrentTask();
			}, 500);
		}
	})

	$('.augusta-button.step-6 .btn').on('click', function() {
		if(!isPendingEmpty()) {
			guessMagic = parseInt($('.augusta-range input').val());
			runMagicGuess();
			
			// Wait a while for dramatic effect
			setTimeout(function() {
				augustaOffset = 0;
				calculateAugustaOffset();

				var chats = ["almost all of them", "all of them"];
				var chosenChat = "";
				if(augustaOffset === 0) {
					chosenChat = chats[1];
				}
				else {
					chosenChat = chats[0];
				}

				// Update text according to augusta offset
				replaceSectionPhrase(26, /\$\$\$/, augustaOffset);

				replaceSectionPhrase(26, /\$almostAll/, chosenChat);

				runCurrentTask();
			}, 500);
		}
	})

	$('.augusta-button.step-7 .btn').on('click', function() {
		if(!isPendingEmpty()) {
			guessMagic = parseInt($('.augusta-range input').val());
			runMagicGuess();
		}
	})
}

function isMagicCloseEnough() {
	guessMagic = parseInt($('.augusta-range input').val());
	return Math.abs(trueMagic - guessMagic) < learningRate;
}

function calculateAugustaOffset() {
	$('.sorter .single-number').each(function() {
		var arrayId = $(this).find('img').data('arrayId');
		var thisNumObj = numberObjs[arrayId];
		var thisSortId = parseInt($(this).parent().parent().attr('data-sort-id'));
		augustaOffset += Math.abs(parseInt(thisNumObj.numberId) - thisSortId);
	});
	augustaOffsetHistory.push(augustaOffset);
}

function updateProgress(callback, timer) {
	var currentWidth = parseInt($('.overlay-interface .progress-bar').css('width'));
	currentWidth = currentWidth < 100 ? currentWidth + 1 : 100;
	if(currentWidth < 100) {
		$('.overlay-interface .progress-bar').width(currentWidth + '%');
	}
	else {
		$('.overlay-interface .progress-bar').width(currentWidth + '%');
		clearInterval(timer);
		setTimeout(callback, 1000);
	}
}

var setProgressTimer;
function setProgress(newWidth) {
	newWidth = newWidth < 100 ? newWidth : 100;
	$('.overlay-interface .progress-bar').width(newWidth + '%');
}

function runMagicGuess() {
	var theseNumbers = shuffle($('.pending .single-number'));
	theseNumbers.each(function(i) {
		var arrayId = $(this).find('img').data('arrayId');
		makeGuess(numberObjs[arrayId], maxSortCount);
		moveImgOnGuess(numberObjs[arrayId], $(this));
	});
}

function makeGuess(thisNumObj) {
	var newMagic = Math.abs(guessMagic - trueMagic);

	// What's the difference between our magic guess and the true magic in mapped number?
	var guessDiff = Math.floor(myRand() * newMagic);
	guessDiff = Math.floor(myP5.map(guessDiff, 0, maxSortCount - 1, 0, 10));

	// Add or subtract the difference depending on whether we guessed above or below
	var guess = thisNumObj.numberId + (guessDiff * (guessMagic > trueMagic ? +1 : -1));
	var guessOff = thisNumObj.numberId > guess ? thisNumObj.numberId - guess : guess - thisNumObj.numberId;

	// Limit guess to 0-9
	guess = Math.min(guess, 9);
	guess = Math.max(0, guess);

	thisNumObj.networkGuess = guess;
}

function moveImgOnGuess(thisNumObj, thisNumElem) {
	$('.sorter .number-container').eq(thisNumObj.networkGuess).append(thisNumElem);
}

function remapMagic(theOldMax, newMax) {
	var thisMax = maxSortCount;
	if(newMax !== undefined) {
		thisMax = newMax;
	}
	if(trueMagic === 1) {
		Math.floor(trueMagic += thisMax / 10);
	}
	else if(trueMagic === theOldMax) {
		Math.floor(trueMagic -= thisMax / 10);
	}
	trueMagic = Math.ceil(myP5.map(trueMagic, 1, theOldMax, 1, thisMax));
}

function learnMagicNumber() {
	runMagicGuess();
	if(guessMagic < trueMagic) {
		guessMagic += learningRate;
	}
	else if(guessMagic > trueMagic) {
		guessMagic -= learningRate;
	}
	guessMagic = Math.min(guessMagic, maxSortCount);
	guessMagic = Math.max(0, guessMagic);
	$('.augusta-range input').val(guessMagic);
}

function fetchImgNames() {
	return new Promise(function(resolve, reject) {
		fetch('./getImgNames').then(function(response) {
			if (response.status !== 200) {
				console.log('Looks like there was a problem. Status Code: ' + response.status);
				return;
			}

			response.json().then(function(data) {
				resolve(data);
			});
		})
		.catch(function(err) {
			reject('Fetch Error :-S', err);
		});
	});
}