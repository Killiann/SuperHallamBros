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
