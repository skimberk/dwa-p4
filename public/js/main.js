(function() {
	'use strict';

	var roomSelection = document.getElementById('room-selection');
	var roomSelectionDropdown = document.getElementById('room-selection-dropdown');
	var roomCreateButton = document.getElementById('room-create-button');
	var roomRenameButton = document.getElementById('room-rename-button');
	var roomDeleteButton = document.getElementById('room-delete-button');

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

	var getPositionOfRoomWithId = function(id) {
		var id = parseInt(id, 10);

		for(var i = 0, len = availableRooms.length; i < len; ++i) {
			if(parseInt(availableRooms[i].id, 10) === id)) {
				return i;
			}
		}

		return -1;
	};

	var roomChangeHandler = function(room) {
		var roomPosition = getPositionOfRoomWithId(room.id);

		roomSelectionDropdown.children[roomPosition].selected = true;
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

	var hashChangeHandler = function() {
		var newRoom = parseInt(location.hash.substring(6), 10);
		var newRoomPosition = getPositionOfRoomWithId(newRoom);

		if(newRoomPosition === -1 && availableRooms[0]) {
			location.hash = '#room=' + parseInt(availableRooms[0].id, 10);
		}
		else if(newRoomPosition !== -1 && newRoom !== activeRoom && availableRooms[0]) {
			roomChangeHandler(availableRooms[newRoomPosition]);
		}
		else {
			messages.innerHTML = '';
			activeRoom = -1;

			if(newRoom !== -1) {
				location.hash = '#room=-1';
			}
		}
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
			hashChangeHandler();
		}
	};

	var getRooms = function() {
		var request = new XMLHttpRequest();
		request.open('GET', '/rooms');
		request.onload = function() {
			availableRoomsChangeHandler(JSON.parse(request.responseText));
		};
		request.send();
	};

	getRooms();

	roomSelectionDropdown.addEventListener('change', function(e) {
		if(e.target.value) {
			location.hash = '#room=' + parseInt(e.target.value, 10);
		}
	}, false);

	window.addEventListener('hashchange', hashChangeHandler, false);

	roomCreateButton.addEventListener('click', function(e) {
		e.preventDefault();

		var name = prompt('Enter the name of the new room:');

		if(name) {
			var request = new XMLHttpRequest();
			request.open('POST', '/rooms');
			request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			request.onload = function() {
				// Done
			};
			request.send('name=' + encodeURIComponent(name));
		}
	}, false);

	roomRenameButton.addEventListener('click', function(e) {
		e.preventDefault();

		if(activeRoom === -1) {
			alert('Create a room first!');
			return;
		}

		var name = prompt('Enter the new name:');

		if(name) {
			var request = new XMLHttpRequest();
			request.open('PUT', '/rooms/' + activeRoom);
			request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			request.onload = function() {
				// Done
			};
			request.send('name=' + encodeURIComponent(name));
		}
	}, false);

	roomDeleteButton.addEventListener('click', function(e) {
		e.preventDefault();

		if(activeRoom === -1) {
			alert('Create a room first!');
			return;
		}

		if(confirm('Are you sure you want to delete this room?')) {
			var request = new XMLHttpRequest();
			request.open('DELETE', '/rooms/' + activeRoom);
			request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			request.onload = function() {
				// Done
			};
			request.send();
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
			request.send('text=' + encodeURIComponent(value) + '&room=' + encodeURIComponent(activeRoom));
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

			if(data === 'rooms-changed') {
				getRooms();
			}
			else {
				getMessage(data, function(message) {
					if(message.room_id == activeRoom) {
						addMessage(message);
					}
				});
			}
		}, false);
	}
}).call(this);
