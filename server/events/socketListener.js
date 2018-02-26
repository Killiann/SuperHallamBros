const plrData = require(__dirname + '/../../server/player/playerData.js');
const gameData = require(__dirname + '/../../server/events/beginGame.js');

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
    gameData.removePlayer();
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

  //Player movement here
  socket.on('movementKeyPress', (data) => {
    let player = playerData[identity];

    if (data.inputID === 'right'){
        player.ctrlRight = data.state;
    }else if (data.inputID === 'left') {
      player.ctrlLeft = data.state;
    }else if (data.inputID === 'jump') {
      player.ctrlJump = data.state;
    }

  });

  socket.on('movementJump', (data) => {
    let player = playerData[identity];
    socket.emit('playerJumper', {player: player.id});
  });

  socket.on('nonEventPlayerMovement', (data) => {
    for (var player in data) {
      if (data.hasOwnProperty(player)) {
        let p = playerData[player];
        p.x = data[player].x;
        p.y = data[player].y;
      }
    }
  });
}