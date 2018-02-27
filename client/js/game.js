let playerEntities = [];

//main needs to be organsied
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
      playerEntities[playersID[i]].attr({h: 80, w:50});
      var playerBackground = Crafty.e('2D, Canvas, Color').attr({h:20, w:50}).color('rgb(70,70,70,0.2)');
      var playerTag = Crafty.e('2D, DOM, Text').text(playerNames[i]).textColor('white').textAlign('center').attr({w:50, h:20}).textFont({size: '14px', family: "Bangers"});
      playerBackground.attach(playerTag);
      playerEntities[playersID[i]].attach(playerBackground);
  }


  //Add event listeners
  addPlayerMovementDetection();
  //updateNonEventCausedPlayerMovement();

  socket.on('playerMovement', function(data){
    updatePlayerPositions(data);
  });

  socket.on('playerJumper', function(data){
      console.log("jumping player " + data.playerID);
      playerEntities[data.playerID].velocity().y -= 300;
  });

}

//move into event class
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

//do we really need this? we'll fnd out in the future
function updateNonEventCausedPlayerMovement(){
  setInterval(function(){
    var playerPositions = {};
    for (var player in playerEntities) {
      if (playerEntities.hasOwnProperty(player)) {
        playerPositions[player] = {x: playerEntities[player].attr().x, y: playerEntities[player].attr().y};
      }
    }
    socket.emit('nonEventPlayerMovement', playerPositions);
  }, 1000/60);
}

//dont know if this is nes for y values as it screws with velocity, may fuck up a knock back system....
function updatePlayerPositions(playerData){
    for (var player in playerData) {
      if (playerData.hasOwnProperty(player)) {
        var p = playerEntities[player];
        p.attr({x: playerData[player].x});
      }
    }
}
