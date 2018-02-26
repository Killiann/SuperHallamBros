exports.sendDataPerSec = (playerData, socketData) => {

  setInterval(() => {
    for (var s in socketData) {
      if (socketData.hasOwnProperty(s)) {
        let socket = socketData[s];
        socket.emit('sendLobbyPlayers', playerData);
      }
    }
  }, 1000);
}

exports.sendToAllSockets = (socketArray, emitName, data) => {
    for (var s in socketArray) {
      if (socketArray.hasOwnProperty(s)) {
        let socket = socketArray[s];
        socket.emit(emitName, data);
      }
    }
}

exports.sendPerTick = (playerData, socketData) => {

  setInterval(() => {

    let playerPacket = {};

    for (var i in playerData) {
      if (playerData.hasOwnProperty(i)) {
        var player = playerData[i];
        player.updatePos();
        playerPacket[player.id] = {x:player.x, y: player.y};
      }
    }
    for (var i in socketData) {
      let socket = socketData[i];
      socket.emit('playerMovement', playerPacket);
    }

  }, 1000/60);
}
