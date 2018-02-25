var playerSelected = false;
var socket;

window.onload = function(){
  console.log("Welcome to Super Hallam Bros");

}

function lobbyBegin() {
    $('#menu').animate({
      opacity : 0.0,
      transform: 'Scale(0.0)'
    }, 400, function(){

        $(this).remove();

        let charMenu = characterMenu();
        let lobbyMenu = lobbyJoiner();

        $('.lobby').append(charMenu, lobbyMenu);
        $(charMenu).animate({'margin-left' : '0',opacity : 1.0});
        $(lobbyMenu).animate({'margin-left' : '0',opacity : 1.0});

    });
}

function lobbySpectate() {
  console.log("This will be a future spectate option once the game is actually in existance and working.");
}

function characterMenu(){
    let backing = $('<div></div>').addClass('panel').css({'marign-left' : '200vw', opacity: 0.0});
    let title = $('<div></div>').addClass('title').text('Select a Character');
    let content = $('<div></div>').addClass('content');

    //Character selection content goes here, append to content
    let charOne = new characterButton(1, 'Meme-et', 'rgb(81, 47, 194)').init();
    let charTwo = new characterButton(2, 'Pascalo', 'rgb(47, 194, 74)').init();
    let charThree = new characterButton(3, 'Magic Mike', 'rgba(237, 50, 50, 0.96)').init();
    let charFour = new characterButton(4, 'Nanny McFee', 'rgb(186, 194, 47)').init();

    //Player info here
    let plrDisplay = playerInfo.init();

    $(content).append(charOne, charTwo, charThree, charFour);
    $(backing).append(title, content, plrDisplay);
    return backing;
};

function lobbyJoiner(){
    let backing = $('<div></div>').addClass('panel').css({'marign-left' : '200vw', opacity: 0.0});
    let title = $('<div></div>').addClass('title').text('Servers:');
    let content = $('<div></div>').addClass('content');

    //Game selection content goes here, append to content
    let joinGameButton = $('<button></button>').text('Join Server').attr({id : 'joinGameID', onclick: 'serverConnection()'});
    let joinedPlayers = $('<div></div>').addClass('title').text('Current Players:');
    let lobbyPlayers = $('<div></div>').addClass('content').attr({id: 'lobbyMenu'});

    $(content).append(joinGameButton);
    $(backing).append(title, content, lobbyPlayers);
    return backing;
};

var playerInfo = {
  charIdentity : null,
  charName : "Character not Selected",
  playerName : null,
  init : function(){
    let backing = $('<div></div>').addClass('title').text('You:');
    let hdnID = $('<input></input>').attr({value : this.charIdentity, hidden: true, id: 'charIDInput'});
    let nameField = $('<input></input>').attr({value: this.charName, id: 'charNameInput', readonly: true}).addClass('inputBox');
    let playerNameField = $('<input></input>').attr({id: 'playerNameInput', placeholder: 'Enter Nickname Here'}).addClass('inputBox');
    $(backing).append(hdnID, $('<br>'), playerNameField, $('<br>'), nameField);
    return backing;
  },
  update : function(){
    $('#charIDInput').attr({value : this.charIdentity});
    $('#charNameInput').attr({value : this.charName});
  },
  //Getters and Setters
  setCharName : function(name){this.charName = name;},
  setCharID : function(characterId){this.charIdentity = characterId;}
}

var characterButton = function(charID, name, image){

    this.init = function(){
      let base = $('<div></div>').addClass('lobbyCharButton').css({background : image, id : 'charButton_' + charID}).text(name);
      $(base).click(function(){
        playerInfo.charIdentity = charID;
        playerInfo.charName = name;
        playerInfo.update();
        playerSelected = true;
      });
      return base;
    }
};

//Deal with socket stuff from here
function serverConnection(){
  if (playerSelected) {
    if (socket == null) {
      onJoin();
      $('#joinGameID').text('Leave Server').attr({onclick: 'onDisconnect()'});
    }else {
      console.log("You're already connected");
    }
  }else {
    console.log("Please select a character...Yes this needs to be a UI warning later on.");
  }
}

//Read stuff send from server
function listenToServer(){
  socket.on('sendLobbyPlayers', function(data){
    $('#lobbyMenu').empty();
    for (var items in data) {
      if (data.hasOwnProperty(items)) {
        var playerBar = $('<div></div>').addClass('content');
        var playerNick = $('<p></p>').text(data[items].playerName);
        var playerCharacter = $('<p></p>').text(data[items].name);
        $(playerBar).append(playerNick, playerCharacter);
        $('#lobbyMenu').append(playerBar);
      }
    }


  });
}

//After join Game
function onJoin(){
  console.log("Connected to the Server.");
  socket = io();
  socket.emit('setupPlayer', {characterName: playerInfo.charName, characterID: playerInfo.charIdentity, playerName: $('#playerNameInput').val()});
  listenToServer();
}

function onDisconnect(){
  if (socket != null) {
    socket.emit('leave');
    socket = null;
    delete socket;
    console.log("Disconnected from the Server");
    $('#joinGameID').text('Join Server').attr({onclick: 'serverConnection()'});
  }else{
    console.log("Not currently connected");
  }
}
