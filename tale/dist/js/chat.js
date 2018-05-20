var noActionTimer,
    noActionQuestionTimer,
    dotsTimer;

var conversationCount = 0;
var currentTask; // A resolve object
var sectionTasks = [];
var sectionConversations = [
	{
	    "phrase": "Hi there! 👋 I was hired to give you a hand with these numbers here. My name's Jesper, but you can call me J. I've set up this chat so we can communicate, and I'll also be in charge of sending you the data that you have to identify. Sound good?",
	    "first_answer": "Yep, that's a deal!",
	    "second_answer": "Do I have a choice?"
	},
	{
	    "phrase": "Okay, let's start identifying some of these numbers. I'll send you ten at a time, and you sort them into the piles. You can look through the number piles by clicking on them.",
	    "first_answer": "Ok, J.",
	    "second_answer": "Ten at a time, got it."
	},
	{
	    "phrase": "All right. 10 down, 69.990 to go.",
	    "first_answer": "That's a lot...",
	    "second_answer": "We can do it!"
	},
	{
	    "phrase": "This could take a while…",
	    "first_answer": "Yeah, I guess you're right.",
	    "second_answer": "Time goes by fast, when you're having fun!"
	},
	{
	    "phrase": "I think we should approach this differently, so how about we get a machine to do it for us?",
	    "first_answer": "That sounds like a good idea.",
	    "second_answer": "If you think that could help us..."
	},
	{
	    "phrase": "I actually have some computer code lying around that could help us. I call it Augusta 1800.",
	    "first_answer": "Interesting!",
	    "second_answer": "Uhm, are you sure it's safe?"
	},
	{
		"phrase": "If you show it a picture of number, it will try to guess what that number is. I'll try uploading it to your window.",
		"first_answer": "Sure thing!",
		"second_answer": "Hmm... Okay then."
	},
	{
	    "phrase": "Let's see if she is as good at labelling as you are.  You should reset the numbers with the <i class=\"fa fa-repeat\"></i> button first, so we can compare. Then just press the Guess button, and see what Augusta finds out.",
	    "first_answer": "Okay, I'll give it a shot.",
	    "second_answer": "👍"
	},
	{
	    "phrase": "Wow, that didn't work at all. In total, the guesses were off by $$$! It looks we have to do some work on this machine.",
	    "first_answer": "Do you have a plan?",
	    "second_answer": "Probably a good idea. What work though?"
	},
	{
	    "phrase": "Perhaps turning Augusta into an artificial neural network will do the trick?",
	    "first_answer": "What's an artificial neural network?",
	    "second_answer": "How would that help us?"
	},
	{
	    "phrase": "A neural network is a powerful type of computer algorithm. It works by using one or more magic numbers, called weights. If you set the weights correctly, it will do amazing things, such as accurately identifying numbers it sees. The only problem is that it needs the exact right weights to work properly.",
	    "first_answer": "Sounds perfect!",
	    "second_answer": "Let's get to it, then!"
	},
	{
	    "phrase": "Alright, I'll start uploading the changes then. Ready?",
	    "first_answer": "Yep, gimme that code!",
	    "second_answer": "I am prepared for whatever comes."
	},
	{
	    "phrase": "I only added one weight for this. I think it should be enough for now. Since we're only working with 10 examples, the weight should be somewhere between 1 and 10. Be sure to reset the numbers, and then let's test Augusta's guessing skills, once you've adjusted the weight with that slider there.",
	    "first_answer": "Okay, let me try.",
	    "second_answer": "👌"
	},
	{
	    "phrase": "This time, she was off by $$$. So, that was $asBadAs.",
	    "first_answer": "Hmmm... Yeah...",
	    "second_answer": "Yup, you got that right."
	},
	{
	    "phrase": "Now, we could just keep guessing here, but there's actually a helpful trick to neural networks, which helps us find the weights. It's called Gradient Descent.",
	    "first_answer": "That sounds mathy...",
	    "second_answer": "Sooo, what does that mean in human words?"
	},
	{
	    "phrase": "If you look at the wrong guesses that Augusta made, you can see that the correct answer was always $below what Augusta guessed. This means that the weight needs to be $toobig.",
	    "first_answer": "That's pretty useful to know!",
	    "second_answer": "You could have told me earlier..."
	},
	{
	    "phrase": "Give the numbers a reset, then try to $increase the weight, before telling Augusta to give it another shot.",
	    "first_answer": "Let me at it!",
	    "second_answer": "Yep yep yep, I get it."
	},
	{
	    "phrase": "I think you got it, because she was off by exactly $$$! I think we should go on, because we've still got 69.990 more numbers to label.",
	    "first_answer": "Ok, let's move on to the next numbers.",
	    "second_answer": "As fun as it is moving sliders, let's move on."
	},
	{
	    "phrase": "Okay, so to recap: Augusta is better than ever at identifying the numbers that we have already labelled, so let's try giving her some new numbers, and seeing if she knows what they are.",
	    "first_answer": "The big test!",
	    "second_answer": "I believe in you, Augusta!"
	},
	{
	    "phrase": "$replacer",
	    "first_answer": "I mean... I'm satisfied.",
	    "second_answer": "What happened?!?"
	},
	{
	    "phrase": "I forgot that when we give Augusta more samples, the required weight changes. And the more samples we give, the bigger the possible range for the weight is. So now the slider goes all the way to 20. That makes it very hard to find the weight, when we have up to 30 million numbers to identify.",
	    "first_answer": "Then what do we do?",
	    "second_answer": "So, are we just giving up?"
	},
	{
	    "phrase": "Lucky for us, I can actually get Augusta to help us find the weight. If we teach her how gradient descent works, she can learn what the correct weight is by herself. I'll upload a fix to you in a sec.",
	    "first_answer": "Go for it!",
	    "second_answer": "Neato."
	},
	{
	    "phrase": "Oh, I've just found 500 numbers lying around the old lady's place that were already sorted! I'll just send those over, so Augusta can use them to learn the weight.",
	    "first_answer": "500?!",
	    "second_answer": "500? Exactly? That's suspicious..."
	},
	{
	    "phrase": "With Augusta's new modifications, you should try feeding those numbers to her, and seeing if she learns how to find the proper weight. It might take a while, but I'm pretty sure she'll get there eventually. Just press the <i class=\"fa fa-graduation-cap\"></i> button to get started.",
	    "first_answer": "Good thing I'm very patient!",
	    "second_answer": "Fingers crossed!"
	},
	{
	    "phrase": "Wow, that was a rousing success! 👏 She found the weight, so now she can accurately identify all of those 500 numbers.",
	    "first_answer": "I think that would have taken me hours...",
	    "second_answer": "I guess that's pretty cool..."
	},
	{
	    "phrase": "Let's try giving her 50 new numbers that she's never seen and seeing if she's able to guess those right.",
	    "first_answer": "I'm so excited! 😮",
	    "second_answer": "Just 50? So conservative! But ok."
	},
	{
	    "phrase": "Yeeeeeessssss! It worked! Looks like she got $almostAll correct! Out of those 50 numbers, her guesses were off by exactly $$$!",
	    "first_answer": "That was incredible!",
	    "second_answer": "Oh wow, I did not expect it to go that well."
	},
	{
	    "phrase": "That's pretty much all there is to neural networks actually.",
	    "first_answer": "That's it?",
	    "second_answer": "Does that mean I'm a neural network expert now?"
	},
	{
	    "phrase": "If we want to make Augusta even more accurate in the future when dealing with new numbers, we would need more identified data to train her.",
	    "first_answer": "That we do by hand, I guess...",
	    "second_answer": "*sigh*"
	},
	{
	    "phrase": "If we're fine with how she is doing now, we can just feed in some more of the numbers, and get Augusta's guesses. Just remember that the more data you want to handle, the more difficult it becomes to find the correct weight.",
	    "first_answer": "Don't worry, I'll be careful.",
	    "second_answer": "Yeah yeah, I get it. It's math."
	},
	{
	    "phrase": "I'll be leaving you alone now, but before I do, I wanted to share one final thing with you.",
	    "first_answer": "So soon? Ok... What did you wanna tell me?",
	    "second_answer": "Tell me, and then I'll say goodbye!"
	},
	{
	    "phrase": "If you want more numbers, just click on Augusta's face, and 50 more will show up. With that said, bon voyage and have fun!",
	    "first_answer": "Cool! I'll be sure to check that out. Ciao!",
	    "second_answer": "Goodbye, friend! Have a good one."
	}
];

var haveRemindedOfMagic = false;
var findMagicNumberConv = {
    "phrase": "You're getting closer, I think. Be sure to use Gradient Descent to figure out whether to increase or decrease the weight.",
    "first_answer": "",
    "second_answer": ""
}

var sectionStops = [
	{
		'stopIndex' : 1,
		'task' : addImagesTask
	},
	{
		'stopIndex' : 6,
		'task' : uploadAugustaTask
	},
	{
		'stopIndex' : 7,
		'task' : resetImagesTask
	},
	{
		'stopIndex' : 11,
		'task' : showAugustaRangeTask
	},
	{
		'stopIndex' : 12,
		'task' : activateAugustaRangeTask
	},
	{
		'stopIndex' : 14,
		'task' : updateOffsetTextTask
	},
	{
		'stopIndex' : 16,
		'task' : resetImagesTask
	},
	{
		'stopIndex' : 18,
		'task' : showNewImagesTask
	},
	{
		'stopIndex' : 21,
		'task' : addSelfLearningTask
	},
	{
		'stopIndex' : 22,
		'task' : sendFoundLabelledImagesTask
	},
	{
		'stopIndex' : 23,
		'task' : awaitMultipleImagesTask
	},
	{
		'stopIndex' : 25,
		'task' : testSelfLearningTask
	},
	{
		'stopIndex' : 29,
		'task' : showOutro
	}
	,
	{
		'stopIndex' : 31,
		'task' : finishOff
	}
];

/*
 * Function for adding some dots that indicate that Joe is typing
 *
 */
function startDots(callback) {
    dotsTimer = setTimeout(function() {
        // Remove any duplicate dots
        removeDots();

        var dot_clone = $('.chat-dots-template').clone();
        dot_clone.removeClass('chat-dots-template').addClass('chat-dots');
        $('.conversation-container').append(dot_clone);
        scrollConversation();
        callback();
    }, getRandom(400, 1200));
}

/*
 * Function for removing the dots
 *
 */
function removeDots() {
    $('.chat-dots').remove();
}

/*
 * Utility function to scroll to the bottom chat
 *
 */
function scrollConversation() {
    var elem = $('.chat-bubble').last();
    var newScrollpos = Math.abs(($('.conversation-container')[0].scrollHeight) + elem.height());
    $('.conversation-container').stop();
    $('.conversation-container').animate({ scrollTop: newScrollpos }, 750);
}

/*
 * Insert questions / answers to the dom
 *
 */
function insertQuestion(data) {
	return new Promise(function(resolve) {
		disableAnswers();
		startDots(function() {
		    noActionQuestionTimer = setTimeout(function() {
		        updateQuestionDOM(data.phrase);

		        $('.answer-option#first-answer').text(data.first_answer);
		        $('.answer-option#second-answer').text(data.second_answer);

		        removeDots();

		        resolve('Question inserted!');
			}, getRandom(1200, 1600));
	    });
    });
}

/*
 * Add a new answer to the conversation and scroll down to it
 *
 */
function updateAnswerDOM(text) {
    $('.answer-option').text('');

    var a_clone = $('.chat-answer-template').clone();
    a_clone.text(text);
    $('.conversation-container').append(a_clone);
    a_clone.addClass('chat-bubble-animating');
    scrollConversation();

    setTimeout(function() {
        a_clone.removeClass('chat-answer-template').addClass('chat-answer');
    }, 1);
}

/*
 * Add a new question to the conversation and scroll down to it
 *
 */
function updateQuestionDOM(text) {
    var q_clone = $('.chat-question-template').clone();
    q_clone.html(text);
    $('.conversation-container').append(q_clone);
    q_clone.addClass('chat-bubble-animating');
    scrollConversation();

    setTimeout(function() {
        q_clone.removeClass('chat-question-template').addClass('chat-question');
    }, 1);
}

function disableAnswers() {
	return new Promise(function(resolve) {
		$('.answer-option').addClass('disabled').off('click');
		resolve();
	});
}

function setAnswerListenersTask() {
	return new Promise(function(resolve) {
		$('.answer-option').removeClass('disabled');
	    $('.answer-option').on('click', function() {
	        updateAnswerDOM($(this).text());
	        resolve('clicked answer!');
	    });
    });
}

function insertQuestionTask() {
	return new Promise(function(resolve) {
		insertQuestion(sectionConversations[conversationCount]).then(function() {
			resolve('Question inserted');
			conversationCount++;
		});
	});
}

function addImagesTask() {
	return new Promise(function(resolve) {
		disableAnswers();
		addImagesToPending(10);
		currentTask = resolve;
		$('#app').addClass('first-images');
		$('#app').data('currentStep', -1);
	});
}

function uploadAugustaTask() {
	return new Promise(function(resolve) {
		disableAnswers();
		$('.overlay-interface').removeClass('hidden');
		$('.overlay-interface .progress-bar').css('width', '0%');
		progressTimer = setInterval(function() {
			updateProgress(function() {
				$('.overlay-interface').addClass('hidden');
				$('#app').addClass('show-augusta');
				$('#app').data('currentStep', 0);
				$('.overlay-interface .progress-bar').css('width', '0%');
				$('.btn').css('pointer-events', 'none').addClass('disabled');
				updateGuessListeners();
				resolve();
			}, progressTimer)
		}, 250);
		currentTask = resolve;
	});
}

function resetImagesTask() {
	return new Promise(function(resolve) {
		$('.btn').css('pointer-events', 'auto').removeClass('disabled');
		disableAnswers();
		currentTask = resolve;
	});
}

function showAugustaRangeTask() {
	return new Promise(function(resolve) {
		disableAnswers();
		$('.overlay-interface').removeClass('hidden');
		progressTimer = setInterval(function() {
			updateProgress(function() {
				$('#app').addClass('show-range');
				$('.overlay-interface').addClass('hidden');
				$('.overlay-interface .progress-bar').css('width', '0%');
				$('.btn').css('pointer-events', 'none').addClass('disabled');
				updateGuessListeners();
				resolve();
			}, progressTimer)
		}, 250);
	});
}

function activateAugustaRangeTask() {
	return new Promise(function(resolve) {
		$('#augusta-range').prop('disabled', false);
		$('.btn').css('pointer-events', 'auto').removeClass('disabled');
		$('.augusta-button').addClass('step-2').removeClass('step-1');
		$('#app').data('currentStep', 2);
		updateGuessListeners();
		disableAnswers();
		currentTask = resolve;
	});
}

function updateOffsetTextTask() {
	$('.augusta-button').addClass('step-3').removeClass('step-2');
	$('#app').data('currentStep', 3);
	updateGuessListeners();

	var below = ["above", "below"];
	var toobig = ["increased", "decreased"];
	var increase = ["increase", "decrease"];

	var chosenWords = [];

	if(guessMagic < trueMagic) {
		chosenWords.push(below[0], toobig[0], increase[0]);
	}
	else {
		chosenWords.push(below[1], toobig[1], increase[1]);
	}

	return new Promise(function(resolve) {
		replaceSectionPhrase(15, /\$below/, chosenWords[0]);
		replaceSectionPhrase(15, /\$toobig/, chosenWords[1]);
		replaceSectionPhrase(16, /\$increase/, chosenWords[2]);
		resolve();
	});
}

function showNewImagesTask() {
	return new Promise(function(resolve) {
		addImagesToPending(10);
		disableAnswers();

		$('.augusta-button').addClass('step-4').removeClass('step-3');
		$('#app').data('currentStep', 4);
		updateGuessListeners();

		currentTask = resolve;
	});
}

function addSelfLearningTask() {
	return new Promise(function(resolve) {
		disableAnswers();

		$('.overlay-interface').removeClass('hidden');
		progressTimer = setInterval(function() {
			updateProgress(function() {
				$('#app').addClass('show-learning');
				$('.overlay-interface .progress-bar').css('width', '0%');
				$('.overlay-interface').addClass('hidden');

				resolve();
			}, progressTimer)
		}, 25);
	});
}

var foundLabelsCount = 0;
var foundLabelsTimer;
function sendFoundLabelledImagesTask() {
	return new Promise(function(resolve) {
		
		disableAnswers();

		$('.overlay-interface').removeClass('hidden');
		$('.progress-bar').text('Receiving images...');
		$('.btn').css('pointer-events', 'none').addClass('disabled');
		foundLabelsTimer = setInterval(function() {
			if(foundLabelsCount < 500) {
				addImagesToPending(20);
				foundLabelsCount += 20;
			}

			setProgress(Math.floor(foundLabelsCount / 5))
			if(foundLabelsCount === 500) {
				$('.overlay-interface').addClass('hidden');

				clearInterval(foundLabelsTimer);

				resolve();
			}
		}, 100);
	});
}

function awaitMultipleImagesTask() {
	return new Promise(function(resolve) {
		disableAnswers();

		$('.augusta-button').addClass('step-5').removeClass('step-4');
		$('.btn').css('pointer-events', 'auto').removeClass('disabled');
		updateGuessListeners();

		currentTask = resolve;
	});
}

function testSelfLearningTask() {
	return new Promise(function(resolve) {
		for(var i = 0; i <= 50; i += 10) {
			setTimeout(function() {
				addImagesToPending(10);
			}, i);
		}
		disableAnswers();

		$('.augusta-button').addClass('step-6').removeClass('step-5');
		$('.augusta-learn, .augusta-reset').css('pointer-events', 'none').addClass('disabled');
		updateGuessListeners();

		currentTask = resolve;
	});
}

function showOutro() {
	return new Promise(function(resolve) {
		disableAnswers();
		$('.outro-overlay-interface').removeClass('hidden');
		$('.augusta-button').addClass('step-7').removeClass('step-6');
		$('.augusta-title h2').text('AUGUSTA 2000');
		updateGuessListeners();
		$('.outro-overlay-interface .btn').click(function() {
			$('#app').addClass('sandbox');

			$('.pending').click(function() {
				addImagesToPending(50);
			});

			resolve();
		});
	});
}

function finishOff() {
	return new Promise(function(resolve) {
		$('.btn').css('pointer-events', 'auto').removeClass('disabled');
		disableAnswers();
		resolve();
	});
}

function startChat() {
	// Run Promises in sequence
	// Source: https://www.bennadel.com/blog/3201-exploring-recursive-promises-in-javascript.htm
	sectionTasks.reduce(
	    function(series, task) {
	        return(series.then(task));
		},
		Promise.resolve()
	);
}

// oldTxt ==> Regex object
function replaceSectionPhrase(index, oldTxt, newTxt) {
	sectionConversations[index].phrase = sectionConversations[index].phrase.replace(oldTxt, newTxt);
}

function replaceThisPhrase(convData, oldTxt, newTxt) {
	convData.phrase = convData.phrase.replace(oldTxt, newTxt);
	return convData;
}

$(document).ready(function() {
	for(let i = 0; i < sectionConversations.length; i++) {
		sectionTasks.push(insertQuestionTask, setAnswerListenersTask);

		for(let j = 0; j < sectionStops.length; j++) {
			if(i === sectionStops[j].stopIndex) {
				sectionTasks.push(sectionStops[j].task);
			}
		}
	}
});

