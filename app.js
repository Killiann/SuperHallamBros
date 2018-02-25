const express = require('express');
const app = express();
const serv = require('http').Server(app);
const socket = require('socket.io')(serv, {});
const socketEvents = require(__dirname + '/server/events/socketListener.js');

let SOCKET_LIST = {};

app.use('/client', express.static(__dirname + '/client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/lobby.html');
});

serv.listen(1337);

socket.sockets.on('connection', (socket) => {
    socketEvents.join(socket, SOCKET_LIST);
});
