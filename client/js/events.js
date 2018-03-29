function handlePlayerInput(){
  addPlayerMovementDetection();
  addPlayerClickDetection();
  updateMousePosition();
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

let addPlayerClickDetection = function(){
  var game = document.getElementById('game');
  var rect = game.getBoundingClientRect();
  game.onclick = function(event){
    var x = event.clientX - rect.left;
    var y = event.clientY;

    // console.log("client click x:" + x + " y:" + y) ;
    socket.emit('playerClick', {x: x, y: y});
  }
}

let updateMousePosition = function(){
  var game = document.getElementById('game');
  var rect = game.getBoundingClientRect();
  game.onmousemove = function(event){
    PLAYER_MOUSE.x = event.clientX - rect.left;
    PLAYER_MOUSE.y = event.clientY;
    socket.emit('mousePosition', {x: PLAYER_MOUSE.x, y: event.clientY});
  }
}
