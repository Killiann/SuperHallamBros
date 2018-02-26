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
      let lobbyTimer = 10;

      console.log("Starting Game:");
      clearInterval(countdown);

      countdown = setInterval(() => {
        console.log("In: " + lobbyTimer);

        lobbyTimer--;
        if (lobbyTimer == 0) clearInterval(countdown);
        if (playerCount < 2) clearInterval(countdown);
        socketSending.sendToAllSockets(socketDetails ,'lobbyCountDown', {time: lobbyTimer});

      }, 1000);

    }
}
