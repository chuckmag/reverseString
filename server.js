'use strict';

const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

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
});

// Add the route
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

// Add the route
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