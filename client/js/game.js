let PLAYER_ENTITIES = [];
let PLAYER_MOUSE = {x: 0, y: 0};

//all image resources we preload and then add players once they're loaded
var sprites = {"sprites": {
  "client/res/img/memetPlayerRun.png" : {
    "tile": 300,
    "tileh": 361,
    "map": { "walker_start": [0,0]}
  }
}};



//main needs to be organsied
function mainGame(gameData){

  //Init game scene
  Crafty.init(720, 720, document.getElementById('game'));
  $('#game').addClass('gameGo');
  $('body').prepend($('<div></div>').attr({id: 'UI'}));

  //Init map Here
  mapGenerator();

  //Init all player entities once all sprites are loaded
  Crafty.load(sprites, function(){

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

    socket.on('EndGame', function(data){
      gameOver(data.winnerID);
    });

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
      socket.emit('gameOver', {winnerID: lastEntity.id});
    }

}

function gameOver(winnerID){

  if(document.getElementById("endGameElement") === null){
    $('#game').animate({
      position: 'absolute',
      opacity: 0.0,
      'margin-top': '-60%'
    }, 1500, function(){
        this.remove();
    });

    //End game ui
    var holder = $('<div></div>').attr({id: 'endGameElement'}).addClass('EndGameHolder');
    var logo = $('<img>').attr({src: 'client/res/img/logo.png', height: '200px'});
    var winnerName = $('<p></p>').text('Congrats ' + PLAYER_ENTITIES[winnerID].nick + '!').addClass('title');
    var counter = $('<p></p>').text('Game restarting in ' + 5).attr({id: 'endCounter'}).addClass('counter');
    $(holder).append(logo, winnerName, counter);
    $('body').append(holder);

    $(holder).animate({
      'margin-top': '0',
      opacity: 1.0
    }, 1000);

    //Timer here
    let secs = 15;
    setInterval(function(){
      secs--;
      $(counter).text('Game restarting in ' + secs);
      if (secs == 0) {
          location.reload(true);
      }
    }, 1000);
  }

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
        PLAYER_ENTITIES[player].updateX(playerData[player].x, playerData[player].mouseX);
      }
    }
}
