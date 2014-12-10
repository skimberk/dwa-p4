(function() {
	'use strict';

	var messageEntryForm = document.getElementById('message-entry-form');
	var messageEntryField = document.getElementById('message-entry-field');

	messageEntryField.addEventListener('keypress', function(e) {
		if(e.keyCode === 13 && !e.shiftKey) {
			e.preventDefault();

			var value = messageEntryField.value.trim();
			messageEntryField.value = '';

			if(value !== '') {
				var request = new XMLHttpRequest();
				request.open('POST', '/messages');
				request.onload = function(e) {
					console.log('Message sent!');
				};
				request.send('message=' + value);
			}
		}
	}, false);
}).call(this);
