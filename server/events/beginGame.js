const socketSending = require(__dirname + '/../../server/events/socketSender.js');
let playerCount = 0;

exports.addPlayer = () => {
  playerCount++;
}

exports.removePlayer = () => {
  playerCount--;
}

exports.canStart = (socket, playerDetails, socketDetails) => {
    this.addPlayer();
    if (playerCount > 1) {

      var countdown;
      let lobbyTimer = 2;

      console.log("Starting Game:");
      clearInterval(countdown);

      countdown = setInterval(() => {
        console.log("In: " + lobbyTimer);

        lobbyTimer--;
        if (lobbyTimer == 0) {
          clearInterval(countdown);
          onGameStart(playerDetails, socketDetails);
        };
        if (playerCount < 2) clearInterval(countdown);
        socketSending.sendToAllSockets(socketDetails ,'lobbyCountDown', {time: lobbyTimer});

      }, 1000);

    }
}

function onGameStart(playerDetails, socketDetails){
    console.log("Sending Lobby Deatils to clients for first game Initialisation.");
    socketSending.sendToAllSockets(socketDetails, 'gameInit', {playerData: playerDetails});
}
