'use strict';

const Hapi = require('hapi');
const SocketIO = require('socket.io');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

var io = SocketIO.listen(server.listener);
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('reverse string', function(s){
    console.log('reversing the string: ' + s);
	var reversedString = reverseString(s);
    console.log('reversed string: ' + reversedString);
	io.emit('reverse string', reversedString);
  });
});

// register a static html page to display at the root of the website.
server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route([
		{method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('./public/index.html');}
		},
		{method: 'GET',
        path: '/src/{fileName}',
        handler: function (request, reply) {
            reply.file('./src/' + request.params.fileName);}
		},
		{method: 'GET',
        path: '/src/dependencies/angular-socket-io-master/{fileName}',
        handler: function (request, reply) {
            reply.file('./src/dependencies/angular-socket-io-master/' + request.params.fileName);}
		}
    ]);
});

const reverseString = function (stringToReverse) {
	return stringToReverse.split('').reverse().join('');
	
	// //without a cheat.. but then why reinvent the wheel
	// var r = '';
	// for (var i = stringToReverse.length - 1; i >= 0; i--)
		// r += stringToReverse[i];
	// return r;
};

const reverseStringHandler = function (request, reply) {
	return reply(reverseString(request.params.stringToReverse));
};


const isPalindrome = function (stringToCheck) {
	if(typeof stringToCheck !== "string") {
		return false;
	}
	
	var stringToCheckStripped = stringToCheck.replace(/ /g, '').toLowerCase();
	if (stringToCheckStripped[0] !== stringToCheckStripped[stringToCheckStripped.length-1]) {
		return false;
	}
	var midPointFloor = Math.floor(stringToCheckStripped.length/2);
	console.log(midPointFloor);
	var reverseHalf = '';
	for (var i = stringToCheckStripped.length - 1; i >= midPointFloor; i--) {
		if (i === midPointFloor && stringToCheckStripped.length % 2 != 0) {
			break;
		}
		reverseHalf += stringToCheckStripped[i];
	}
	console.log("First half of string = " + stringToCheckStripped.substring(0,midPointFloor));
	console.log("Second half reversed string = " + reverseHalf);
	console.log("Is Palindrome? " + (stringToCheckStripped.substring(0,midPointFloor) === reverseHalf));
	return stringToCheckStripped.substring(0,midPointFloor) === reverseHalf;
};

const palindromeHandler = function (request, reply) {
	return reply(isPalindrome(request.params.stringToCheck));
};

const isPalindromeBad = function (stringToCheck, reverseStringToCheck) {
	if(typeof stringToCheck !== 'string' || typeof reverseStringToCheck !== 'string') {
		return false;
	}
	
	stringToCheck = stringToCheck.replace(/ /g, '').toLowerCase();
	reverseStringToCheck = reverseStringToCheck.replace(/ /g, '').toLowerCase();
	
	return stringToCheck === reverseStringToCheck;
};

const palindromeBadHandler = function (request, reply) {
	var stringToCheckParts = request.params.stringToCheck.split('/');
	return reply(isPalindromeBad(stringToCheckParts[0],stringToCheckParts[1]));
};

// Adding a route to reverse a string that is sent as a parameter.
server.route([{
    method: 'GET',
    path:'/reverseString/{stringToReverse}', 
    handler: reverseStringHandler
	},
	{method: 'GET',
    path:'/isPalindrome/{stringToCheck}', 
    handler: palindromeHandler
	},
	{method: 'GET',
    path:'/isPalindromeBad/{stringToCheck*2}', 
    handler: palindromeBadHandler
	}]);

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});