const express = require('express');
const app = express();
const serv = require('http').Server(app);
const sokcet = require('socket.io')(serv, {});

app.use('/client', express.static(__dirname + '/client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/lobby.html');
});

serv.listen(1337);
