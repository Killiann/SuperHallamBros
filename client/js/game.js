let PLAYER_ENTITIES = [];

//main needs to be organsied
function mainGame(gameData){

  //Init game scene
  Crafty.init(720, 720, document.getElementById('game'));

  //Init map Here
  mapGenerator();

  //Init all player entities
  addPlayers(gameData.playerData);

  //Add client event listeners
  handlePlayerInput();


  //updateNonEventCausedPlayerMovement();
  socket.on('playerMovement', function(data){
    updatePlayerPositions(data);
  });

  socket.on('playerJumper', function(data){
      PLAYER_ENTITIES[data.playerID].jump();
  });

  socket.on('playerClicked', function(data){
      PLAYER_ENTITIES[data.playerID].fireWeaponAt(data.x, data.y);
  });

  socket.on('playerConfirmHit', function(data){
    PLAYER_ENTITIES[data.playerID].onDamage(data.health);
  });
  socket.on('playerDead', function(data){
    PLAYER_ENTITIES[data.playerID].die();
  });

}

function checkForGameOver(){
  var alive = 0;
  var lastID;
    for (var winner in PLAYER_ENTITIES) {
      if (PLAYER_ENTITIES.hasOwnProperty(winner)) {
        if (PLAYER_ENTITIES[winner].dead == false) {
          alive++;
          lastEntity = PLAYER_ENTITIES[winner];
        }
      }
    }
    if (alive == 1) {
      console.log("Game over. The winner is " + lastEntity.nick + " with id: " + lastEntity.id);
      gameOver();
    }

}

function gameOver(){
  //Timer here 
  socket.emit('leave');
  location.reload(true);
}


//do we really need this? we'll fnd out in the future
function updateNonEventCausedPlayerMovement(){
  setInterval(function(){
    var playerPositions = {};
    for (var player in PLAYER_ENTITIES) {
      if (playerEntities.hasOwnProperty(player)) {
        playerPositions[player] = {x: PLAYER_ENTITIES[player].getX, y: PLAYER_ENTITIES[player].getY};
      }
    }
    socket.emit('nonEventPlayerMovement', playerPositions);
  }, 1000/60);
}

//dont know if this is nes for y values as it screws with velocity, may fuck up a knock back system....
function updatePlayerPositions(playerData){
    for (var player in playerData) {
      if (playerData.hasOwnProperty(player)) {
        PLAYER_ENTITIES[player].updateX(playerData[player].x);
      }
    }
}
