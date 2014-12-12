(function() {
	'use strict';

	var messageEntry = document.getElementById('message-entry');
	var messageEntryForm = document.getElementById('message-entry-form');
	var messageEntryField = document.getElementById('message-entry-field');
	var messages = document.getElementById('messages');

	var padMessages = function() {
		messages.style.paddingBottom = messageEntry.offsetHeight + 'px';
	};

	padMessages();
	window.addEventListener('resize', padMessages, false);

	messageEntryForm.addEventListener('submit', function(e) {
		e.preventDefault();

		var value = messageEntryField.value.trim();
		messageEntryField.value = '';

		if(value !== '') {
			var request = new XMLHttpRequest();
			request.open('POST', '/messages');
			request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			request.onload = function(e) {
				// Message sent
			};
			request.send('message=' + value);
		}
	}, false);

	messageEntryField.addEventListener('keypress', function(e) {
		if(e.keyCode === 13 && !e.shiftKey) {
			e.preventDefault();

			var event = new Event('submit');
			messageEntryForm.dispatchEvent(event);
		}
	}, false);

	var getMessage = function(id, callback) {
		var request = new XMLHttpRequest();
		request.open('GET', '/messages/' + id);
		request.onload = function() {
			callback(JSON.parse(request.responseText));
		};
		request.send();
	};

	if(!!window.EventSource) {
		var source = new EventSource(location.protocol + '//' + location.hostname + ':6789');

		source.addEventListener('message', function(e) {
			var data = JSON.parse(e.data);

			getMessage(data, function(message) {
				var atBottom = false;

				if((window.pageYOffset || document.documentElement.scrollTop) + window.innerHeight >= document.body.scrollHeight - 10) {
					atBottom = true;
				}

				messages.innerHTML += '<div class="row">' + message.text + '</div>';

				if(atBottom) {
					window.scrollTo(0, document.body.scrollHeight);
				}
			});
		}, false);
	}
}).call(this);
