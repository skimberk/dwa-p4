<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Chat App (Project 4)</title>

	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="stylesheet" href="/css/normalize.css">
	<link rel="stylesheet" href="/css/skeleton.css">
	<link rel="stylesheet" href="/css/styles.css">

	<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Raleway:400,300,600">
</head>
<body>
	<div class="room-selection">
		<div class="container"></div>
	</div>
	<div class="messages container" id="messages"></div>
	<div class="message-entry" id="message-entry">
		<div class="container">
			<div class="row">
				<form action="javascript:void(0)" id="message-entry-form">
					<div class="nine columns">
						<textarea placeholder="Enter message here." id="message-entry-field"></textarea>
					</div>
					<div class="three columns">
						<input type="submit" value="Send" class="button-primary">
					</div>
				</form>
			</div>
		</div>
	</div>

	<script src="/js/main.js"></script>
</body>
</html>
