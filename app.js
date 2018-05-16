 
const express = require('express');
const path = require('path');
const pckg = require('./package.json');
const bodyParser = require('body-parser')
const fs = require('fs');

var app = express();

app.use(bodyParser.json());
app.use(express.json());

app.set('port', (process.env.PORT || 5000));

app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

// A Visualized Network
app.get('/visualized', function (req, res) {
	res.sendFile(path.join(__dirname + '/visualized/index.html'));
});
app.use('/visualized/dist', express.static(__dirname + '/visualized/dist'));

// The World's Dumbest Dog
app.get('/neura', function (req, res) {
	res.sendFile(path.join(__dirname + '/neura/index.html'));
});
app.use('/neura/dist', express.static(__dirname + '/neura/dist'));

// A Tale of 70.000 Numbers
app.get('/tale', function (req, res) {
	res.sendFile(path.join(__dirname + '/tale/index.html'));
});
app.use('/tale/dist', express.static(__dirname + '/tale/dist'));

app.get('tale/getImgNames', function (req, res) {
	var imgNameArrays = [[], []];
	for(var i = 0; i < 10; i++) {
		imgNameArrays[0].push([]);
		imgNameArrays[1].push([]);

		var test = fs.readdirSync('/tale/dist/img/test/' + i);
		test.forEach(file => {
			if(file.includes('.png')) {
				imgNameArrays[0][i].push(file);
			}
		});

		var train = fs.readdirSync('/tale/dist/img/training/' + i);
		train.forEach(file => {
			if(file.includes('.png')) {
				imgNameArrays[1][i].push(file);
			}
		});
	}

	res.send(JSON.stringify(imgNameArrays));
});

app.listen(app.get('port'), function () {
  console.log('"' + pckg.name + '" server started listening on this port: ' + app.get('port'));
});