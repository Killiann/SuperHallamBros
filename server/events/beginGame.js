const socketSending = require(__dirname + '/../../server/events/socketSender.js');
let playerCount = 0;
var countdown;

exports.addPlayer = () => {
  playerCount++;
}

exports.removePlayer = () => {
  playerCount--;
}

exports.canStart = (socket, playerDetails, socketDetails, game_in_prog) => {
  //console.log("\n " + game_in_prog.joinable + " is ??");
    if(game_in_prog.joinable){

      this.addPlayer();
      if (playerCount > 1) {


        let lobbyTimer = 10;

        console.log("Starting Game:");
        clearInterval(countdown);

        countdown = setInterval(() => {
          console.log("In: " + lobbyTimer);

          lobbyTimer--;
          if (lobbyTimer == 0) {
            clearInterval(countdown);
            onGameStart(playerDetails, socketDetails);
            game_in_prog.joinable = false;
          };
          if (playerCount < 2) clearInterval(countdown);
          socketSending.sendToAllSockets(socketDetails ,'lobbyCountDown', {time: lobbyTimer});

        }, 1000);

      }

    }

}

function onGameStart(playerDetails, socketDetails){
    console.log("Sending Lobby Deatils to clients for first game Initialisation.");
    socketSending.sendToAllSockets(socketDetails, 'gameInit', {playerData: playerDetails});
}
