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
