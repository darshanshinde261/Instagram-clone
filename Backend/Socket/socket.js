const { Server } = require('socket.io');
const express = require('express');
const http = require('http');

// Create the express app
const app = express();

// Create the HTTP server from express app
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods:['GET','POST'],
    }
});


// Object to track user sockets
const userSocketMap = {};

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

// Handle new socket connections
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id; // Add user to the map
        console.log(`User connected = ${userId}, socket id = ${socket.id}`);
    }
    // Emit the list of online users to all clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
    
    socket.on('disconnect', () => {
        if (userId) {
            delete userSocketMap[userId]; // Remove user from map
        }
        // Emit the updated list of online users to all clients
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});


  

// Export app, HTTP server, and Socket.IO server for use in index.js
module.exports = { app, io, server,getReceiverSocketId };
