// Express is a node module for building HTTP servers
var express = require('express');
var app = express();

// Tell Express to look in the "public" folder for any files first
app.use(express.static('public'));

// If the user just goes to the "route" / then run this function
app.get('/', function (req, res) {
  res.send('Hello World!')
});

// Here is the actual HTTP server 
var http = require('http');
// We pass in the Express object
var httpServer = http.createServer(app);
// Listen on port 80, the default for HTTP
httpServer.listen(80);

// WebSocket Portion
// WebSockets work with the HTTP server
// Using Socket.io
const { Server } = require('socket.io');
const io = new Server(httpServer, {});

// Old version of Socket.io
//var io = require('socket.io').listen(httpServer);

let users = {};

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
	
        users[socket.id] = socket;

		socket.on('connect', function() {
			// console.log(socket.io.engine.id);     // old ID
			// socket.io.engine.id = 'username';
			// console.log(socket.io.engine.id);     // new ID
		});
		console.log("We have a new client: " + socket.id);
		
        socket.on('mouse', function(data) {
            io.sockets.emit('mouse', data);
        });

        socket.on('blink', function(data) {
            io.sockets.emit('blink', data);
        });

        socket.on('named', function(namedata) {
			// Data comes in as whatever was sent, including objects
			console.log("Received: 'named' " + namedata);

            users[socket.id].username = namedata;
			
			// Send it to all of the clients
			io.sockets.emit('named', namedata);
		});

		// When this user emits, client side: socket.emit('otherevent',some data);
		socket.on('chatmessage', function(chatdata) {
			// Data comes in as whatever was sent, including objects
			console.log("Received: 'chatmessage' " + chatdata);

            chatdata = users[socket.id].username + ":" + chatdata;
			
			// Send it to all of the clients
			io.emit('chatmessage', chatdata);
		});
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);