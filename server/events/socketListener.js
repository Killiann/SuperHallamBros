const plrData = require(__dirname + '/../../server/player/playerData.js');

exports.join = (socket, socketList) => {
  socket.id = Math.random();
  socketList[socket.id] = socket;
  console.log("New connection on the server for socket id: " + socket.id);
}

exports.eventListener = (socket, socketList, playerData) => {
  var identity = socket.id;

  socket.on('disconnect', () => {
    console.log("removed player with id " + identity);
    delete socketList[identity];
    delete playerData[identity];
  });

  //This is here to force leave from client even if still on page.
  socket.on('leave', () => {
    socket.disconnect();
  });

  //This is once the player joins the lbby the server is sent to here
  socket.on('setupPlayer', (data) => {
      player = plrData.Player(identity, data.characterName, data.characterID, data.playerName);
      playerData[identity] = player;
  });
}
