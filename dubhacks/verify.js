"use strict";
var https = require("https");

module.exports = function(secondURL, callback) {
var faceIds = [];
var isIdentical = true;
var confidence = 0;
var matchName = null;
var faceURL1 = null;
ajaxRequest();

var faceURL2 = JSON.stringify({
	"url" : secondURL
});


function sendRequest(url, firstOrSecond){
	var options = {
		host: 'api.projectoxford.ai',
		path: '/face/v1.0/detect?returnFaceId=true',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
	        'Ocp-Apim-Subscription-Key': '04ea533db3aa4b64a057f84c21aca40b'
		}
	};

	var request = https.request(options, function(response) {
		var id = "";
		response.on('data', function(data) {
			var text = JSON.parse(data);
			console.log(text);
			console.log(text[0]);
			if (text[0]) {
				id = text[0].faceId;
			} else {
				id = null
			}
			faceIds.push(id);
		});

		response.on('end', function() {
			if (firstOrSecond) {
				sendRequest(faceURL2, false);
			} else {
				sendVerify();
			}
		});
	});

	request.write(url);
	request.end();
}


function sendVerify() {
	var options = {
		host: 'api.projectoxford.ai',
		path: '/face/v1.0/verify',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
	        'Ocp-Apim-Subscription-Key': '04ea533db3aa4b64a057f84c21aca40b'
		}
	};

	var request = https.request(options, function(response) {
		response.on('data', function(data) {
			var text = JSON.parse(data);
			isIdentical = text.isIdentical;
			confidence = text.confidence
		});

		response.on('end', function() {
			var returnObj = {
				match: isIdentical,
				certainty: confidence,
				matchName: matchName
			}
			console.log(isIdentical);
			console.log(confidence);
			callback(returnObj);
		});
	});

	var ids = JSON.stringify({
		'faceId1' : faceIds[0],
		'faceId2' : faceIds[1]
	});
	if (!faceIds[0] || !faceIds[1]) {
		console.log('cancel');
		var returnObj = {
			match: false,
			certainty: 0,
			matchName: null
		}
		callback(returnObj);

		request.abort();
	}
	request.write(ids);
	request.end();
}

function ajaxRequest() {
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var ajax = new XMLHttpRequest();
	ajax.onload = function() {
		var json = JSON.parse(ajax.responseText);
		faceURL1 = JSON.stringify({
			'url' : json[0].picture
		});
		matchName = json[0].name;

		sendRequest(faceURL1, true);
	};
	ajax.open("GET", "https://raw.githubusercontent.com/ihoegen/Dubhacks2016/master/contacts.json", true);
	ajax.send();
}
}
