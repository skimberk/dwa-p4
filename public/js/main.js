(function() {
	'use strict';

	var messageEntryForm = document.getElementById('message-entry-form');
	var messageEntryField = document.getElementById('message-entry-field');
	var messages = document.getElementById('messages');

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

	if(!!window.EventSource) {
		var source = new EventSource(location.protocol + '//' + location.hostname + ':6789');

		source.addEventListener('message', function(e) {
		  var data = JSON.parse(e.data);

		  messages.innerHTML += '<div class="row">' + data + '</div>';
		}, false);
	}
}).call(this);
