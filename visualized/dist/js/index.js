var updateLoop;

var inputNeurons = [];
var hiddenNeurons = [];
var outputNeurons = [];

var inputWeights = [];
var hiddenWeights = [];

var weightsTemplate, nodeTemplate;

$(document).ready(function() {
	weightsTemplate = $('.nn-weight-form-container.template');
	nodeTemplate = $('.nn-node.template');

	setupNetwork(2, 2, 1).then(function(msg) {
		console.log(msg);

		updateValues();

		updateLoop = setInterval(updateValues, 50);
	}, function(err) {
		console.log('Something went wrong: ' + err);
	});

	$('input[type="range"]').on('keydown', function(e) {
		if(e.originalEvent.key === 'Shift') {
			$(this).attr('step', 0.5);
		}
	});

	$('input[type="range"]').on('keyup', function(e) {
		if(e.originalEvent.key === 'Shift') {
			$(this).attr('step', 0.001);
		}
	});
});

var setupNetwork = function(inputCount, hiddenCount, outputCount) {
	return new Promise(function(resolve, reject) {
		for(let i = 0; i < inputCount; i++) {
			// Make weights and neurons
			var newVal = Math.random();
			inputNeurons.push(newVal);

			// Make data inputs
			var newDataInput = weightsTemplate.clone();
			newDataInput.appendTo('.nn-weight-forms.nn-input-data').removeClass('template');
			var newDataId = 'nn-data-' + i + '-form';
			var newDataTxt = 'Input ' + i;

			newDataInput.find('label').attr('for', newDataId).text(newDataTxt).data('label', newDataTxt);
			newDataInput.find('input').attr('id', newDataId).val(newVal);

			var newNode = nodeTemplate.clone();
			newNode.appendTo('.nn-inputs').removeClass('template').attr('id', 'nn-node-i' + i);
			newNode.data('value', newVal).text(newVal.toFixed(2));

			inputWeights.push([]);

			for(let j = 0; j < hiddenCount; j++) {
				var newWeight = Math.random();
				inputWeights[i].push(newWeight);

				var newInput = weightsTemplate.clone();
				newInput.appendTo('.nn-weight-forms.nn-input-weights').removeClass('template');
				var newId = 'nn-i' + i + '-h' + j + '-form';
				var newTxt = 'In ' + i + ' / Hid ' + j;
				newInput.find('label').attr('for', newId).text(newTxt).data('label', newTxt);
				newInput.find('input').attr('id', newId).val(newWeight);
			}
		}

		for(let i = 0; i < hiddenCount; i++) {
			var newVal = Math.random();
			hiddenNeurons.push(newVal);

			var newNode = nodeTemplate.clone();
			newNode.appendTo('.nn-hiddens').removeClass('template').attr('id', 'nn-node-h' + i);
			newNode.data('value', newVal).text(newVal.toFixed(2));

			hiddenWeights.push([]);

			for(let j = 0; j < outputCount; j++) {
				var newWeight = Math.random();
				hiddenWeights[i].push(newWeight);

				var newInput = weightsTemplate.clone();
				newInput.appendTo('.nn-weight-forms.nn-hidden-weights').removeClass('template');
				var newId = 'nn-h' + i + '-o' + j + '-form';
				var newTxt = 'Hid ' + i + ' / Out ' + j;
				newInput.find('label').attr('for', newId).text(newTxt).data('label', newTxt);
				newInput.find('input').attr('id', newId).val(newWeight);
			}
		}

		for(let i = 0; i < outputCount; i++) {
			var newVal = Math.random();
			outputNeurons.push(newVal);
			
			var newNode = nodeTemplate.clone();
			newNode.appendTo('.nn-outputs').removeClass('template').attr('id', 'nn-node-o' + i);
			newNode.data('value', newVal).text(newVal.toFixed(2));
		}

		$('.template').remove();
		resolve('Network succesfully created.');
	});
}

var toggleLabels = function(elem, shouldShow) {
	var thisLabel = elem.siblings('label');
	if(shouldShow) {
		thisLabel.text(elem.val());
	}
	else {
		thisLabel.text(thisLabel.data('label'));
	}
}

var updateValues = function() {
	// Get newest form values
	for(let i = 0; i < inputNeurons.length; i++) {
		var newDataId = 'nn-data-' + i + '-form';
		inputNeurons[i] = $('#' + newDataId).get(0).valueAsNumber;

		for(let j = 0; j < hiddenNeurons.length; j++) {
			var newId = 'nn-i' + i + '-h' + j + '-form';
			inputWeights[i][j] = $('#' + newId).val();
		}
	}

	for(let i = 0; i < hiddenNeurons.length; i++) {
		for(let j = 0; j < outputNeurons.length; j++) {
			var newId = 'nn-h' + i + '-o' + j + '-form';
			hiddenWeights[i][j] = $('#' + newId).val();
		}
	}

	// Calculate hidden neurons
	for(let i = 0; i < inputNeurons.length; i++) {
		for(let j = 0; j < hiddenNeurons.length; j++) {
			var newSum = inputWeights[i][j];
			hiddenNeurons[j] += inputNeurons[i] * inputWeights[i][j];
		}
	}

	for(let i = 0; i < hiddenNeurons.length; i++) {
		hiddenNeurons[i] = sigmoid(hiddenNeurons[i]);
	}

	// Calculate output neurons
	for(let i = 0; i < hiddenNeurons.length; i++) {
		for(let j = 0; j < outputNeurons.length; j++) {
			var newSum = hiddenWeights[i][j];
			outputNeurons[j] += hiddenNeurons[i] * hiddenWeights[i][j];
		}
	}

	for(let i = 0; i < outputNeurons.length; i++) {
		outputNeurons[i] = sigmoid(outputNeurons[i]);
	}

	updateLabels();
}

var updateLabels = function() {
	$('input[type="range"]').each(function(i) {
		if($(this).is(':hover')) {
			toggleLabels($(this), true);
		}
		else {
			toggleLabels($(this), false);
		}
	});

	for(let i = 0; i < inputNeurons.length; i++) {
		$('#nn-node-i' + i).text(inputNeurons[i].toFixed(2));
	}

	for(let i = 0; i < hiddenNeurons.length; i++) {
		$('#nn-node-h' + i).text(hiddenNeurons[i].toFixed(2));
	}

	for(let i = 0; i < outputNeurons.length; i++) {
		$('#nn-node-o' + i).text(outputNeurons[i].toFixed(2));
	}
}

var map = function(num, in_min, in_max, out_min, out_max) {
	if(num < in_min) {
		return out_min;
	}
	else if(num > in_max) {
		return out_max;
	}
	return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var sigmoid = function(t) {
	return 1 / (1 + Math.exp(-t));
}

