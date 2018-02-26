let playerEntities = [];

function mainGame(gameData){

  let playerCount = gameData.playerAmount;
  let playersID = gameData.playersID;
  let playerNames = gameData.playerNick;
  //Init game scene
  Crafty.init(720, 720, document.getElementById('game'));

  //Init map Here
  var ground = Crafty.e('Ground, 2D, Canvas, Color').attr({x: 60, y: 500, w:700, h: 20}).color('rgb(52, 163, 117)');

  //Init all player entities
  for (var i = 0; i < playerCount; i++) {
      playerEntities[playersID[i]] = Crafty.e('Player, 2D, Canvas, Gravity, Color, Motion').color('rgb(78, 78, 78)').gravity('Ground');
      playerEntities[playersID[i]].attr({h: 50, w:50});
      var playerTag = Crafty.e('2D, DOM, Text').text(playerNames[i]);
      playerEntities[playersID[i]].attach(playerTag);
  }

  //Add event listeners
  addPlayerMovementDetection();
  updateNonEventCausedPlayerMovement();

  socket.on('playerMovement', function(data){
    updatePlayerPositions(data);
  });

  socket.on('playerJumper', function(data){
      playerEntities[data.player].velocity().y -= 100;
  });

}

let addPlayerMovementDetection = function(){
  document.onkeydown = function(e){
    if (e.keyCode === 68) { //d
        socket.emit('movementKeyPress', {inputID: 'right', state: true});
      }else if (e.keyCode === 65) { //a
        socket.emit('movementKeyPress', {inputID: 'left', state: true});
      }else if(e.keyCode === 87){ //W
        socket.emit('movementJump', {inputID: 'jump'});
      }
    }
    document.onkeyup = function(e){
        if (e.keyCode === 68) { //d
          socket.emit('movementKeyPress', {inputID: 'right', state: false});
        }else if (e.keyCode === 65) { //a
          socket.emit('movementKeyPress', {inputID: 'left', state: false});
        }
    }
}

function updateNonEventCausedPlayerMovement(){
  setInterval(function(){
    var playerPositions = {};
    for (var player in playerEntities) {
      if (playerEntities.hasOwnProperty(player)) {
        playerPositions[player] = {x: playerEntities[player].attr().x, y: playerEntities[player].attr().y};
      }
    }
    socket.emit('nonEventPlayerMovement', playerPositions);
  }, 4);
}

function updatePlayerPositions(playerData){
    for (var player in playerData) {
      if (playerData.hasOwnProperty(player)) {
        var p = playerEntities[player];
        p.attr({x: playerData[player].x, y: playerData[player].y});
      }
    }
}
