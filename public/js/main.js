(function() {
	'use strict';

	var roomSelection = document.getElementById('room-selection');
	var roomSelectionDropdown = document.getElementById('room-selection-dropdown');

	var messageEntry = document.getElementById('message-entry');
	var messageEntryForm = document.getElementById('message-entry-form');
	var messageEntryField = document.getElementById('message-entry-field');
	var messages = document.getElementById('messages');

	var padMessages = function() {
		messages.style.paddingTop = roomSelection.offsetHeight + 'px';
		messages.style.paddingBottom = messageEntry.offsetHeight + 'px';
	};

	padMessages();
	window.addEventListener('resize', padMessages, false);

	var activeRoom = -1;
	var availableRooms = [];

	var addMessage = function(message) {
		var atBottom = false;

		if((window.pageYOffset || document.documentElement.scrollTop) + window.innerHeight >= document.body.scrollHeight - 10) {
			atBottom = true;
		}

		var messageElement = document.createElement('div');
		messageElement.className = 'message';
		messageElement.innerHTML = message.text;
		messages.appendChild(messageElement);

		if(atBottom) {
			window.scrollTo(0, document.body.scrollHeight);
		}
	};

	var getRoomWithId = function(id) {
		for(var i = 0, len = availableRooms.length; i < len; ++i) {
			var room = availableRooms[i];

			if(room.id === id) {
				return room;
			}
		}
	};

	var roomChangeHandler = function(room) {
		activeRoom = room.id;
		messages.innerHTML = '';

		var request = new XMLHttpRequest();
		request.open('GET', '/rooms/' + activeRoom);
		request.onload = function() {
			var messages = JSON.parse(request.responseText);

			for(var i = 0, len = messages.length; i < len; ++i) {
				addMessage(messages[i]);
			}
		};
		request.send();
	};

	var availableRoomsChangeHandler = function(rooms) {
		roomSelectionDropdown.innerHTML = '';

		var activeRoomStillExists = false;
		availableRooms = rooms;

		for(var i = 0, len = rooms.length; i < len; ++i) {
			var room = rooms[i];

			var optionElement = document.createElement('option');
			optionElement.value = room.id;
			optionElement.innerHTML = room.name;

			if(activeRoom == room.id) {
				activeRoomStillExists = true;
				optionElement.selected = true;
			}

			roomSelectionDropdown.appendChild(optionElement);
		}

		if(!activeRoomStillExists) {
			activeRoom = rooms[0].id;
			roomSelectionDropdown.children[0].selected = true;

			roomChangeHandler(rooms[0]);
		}
	};

	var getRooms = function() {
		var request = new XMLHttpRequest();
		request.open('GET', '/rooms/');
		request.onload = function() {
			availableRoomsChangeHandler(JSON.parse(request.responseText));
		};
		request.send();
	};

	getRooms();

	roomSelectionDropdown.addEventListener('change', function(e) {
		if(e.target.value) {
			roomChangeHandler(getRoomWithId(parseInt(e.target.value, 10)));
		}
	}, false);

	messageEntryForm.addEventListener('submit', function(e) {
		e.preventDefault();

		var value = messageEntryField.value.trim();

		if(value !== '' && activeRoom !== -1) {
			messageEntryField.value = '';

			var request = new XMLHttpRequest();
			request.open('POST', '/messages');
			request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			request.onload = function(e) {
				// Message sent
			};
			request.send('text=' + value + '&room=' + activeRoom);
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
				addMessage(message);
			});
		}, false);
	}
}).call(this);
