var express = require('express');
var redis = require('redis');
var app = express();
var client = redis.createClient();

client.on('error', function(err) {
	console.log('Redis error: ' + err);
});

var handlers = [];

client.on('message', function(channel, message) {
	for(var i = 0, len = handlers.length; i < len; ++i) {
		handlers[i](message);
	}
});

client.subscribe('messages');

app.get('/', function(req, res) {
	// set timeout as high as possible
	req.socket.setTimeout(Infinity);

	// send headers for event-stream connection
	// see spec for more information
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});

	var handler = function(number) {
		var json = JSON.stringify('' + number);

		res.write('data: ' + json + '\n\n');
	};

	handlers.push(handler);

	req.on('close', function() {
		for(var i = 0, len = handlers.length; i < len; ++i) {
			if(handler === handlers[i]) {
				handlers.splice(i, 1);
				break;
			}
		}
	});
});

var server = app.listen(6789, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Express listening at http://%s:%s', host, port);
});
