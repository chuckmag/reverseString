'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});


// register a static html page to display at the root of the website.
server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('./public/index.html');
        }
    });
	
	server.route({
        method: 'GET',
        path: '/src/{fileName}',
        handler: function (request, reply) {
            reply.file('./src/' + request.params.fileName);
        }
    });
});

// Basic hello world route.
server.route({
    method: 'GET',
    path:'/hello', 
    handler: function (request, reply) {
			
        return reply('hello world');
    }
});

const reverseString = function (stringToReverse) {
	return stringToReverse.split('').reverse().join('');
};

const reverseStringHandler = function (request, reply) {
	return reply(reverseString(request.params.stringToReverse));
};

// Adding a route to reverse a string that is sent as a parameter.
server.route({
    method: 'GET',
    path:'/reverseString/{stringToReverse}', 
    handler: reverseStringHandler
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});