const express = require('express');
const app = express();
const serv = require('http').Server(app);
const socket = require('socket.io')(serv, {});
const socketEvents = require(__dirname + '/server/events/socketListener.js');
const socketSending = require(__dirname + '/server/events/socketSender.js');

let SOCKET_LIST = {};
let PLAYER_DATA = {};

app.use('/client', express.static(__dirname + '/client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/lobby.html');
});

serv.listen(1337);

socket.sockets.on('connection', (socket, data) => {
    socketEvents.join(socket, SOCKET_LIST);
    socketEvents.eventListener(socket, SOCKET_LIST, PLAYER_DATA);
});

socketSending.sendDataPerSec(PLAYER_DATA, SOCKET_LIST);
