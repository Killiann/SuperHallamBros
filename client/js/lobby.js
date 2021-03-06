var playerSelected = false;
var socket;
var gameBeginTimer;

window.onload = function(){
  console.log("Welcome to Super Hallam Bros");

  let backingImage = $('<img>').attr({src: "client/res/MemetNoShadow.png", height: "100%", id: 'splashImage1'}).css({position: 'fixed', bottom: '-10%', left: '-22%', 'z-index' : '-3', 'opacity' : '0.75'});
  $('body, html').append(backingImage);
}

function lobbyBegin() {
    $('#logo').animate({
      'width': '25%',
      'margin-bottom': '-3%'
    });
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
    let lobbyTimer = $('<div></div>').text("Game can't start; Not enough players. (2 Min)").attr({id: 'lobbyTimer'});
    let joinedPlayers = $('<div></div>').addClass('title').text('Current Players:');
    let lobbyPlayers = $('<div></div>').addClass('content').attr({id: 'lobbyMenu'});

    $(content).append(joinGameButton, lobbyTimer);
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
        var playerBar = $('<div></div>').addClass('title').css({'font-size' : '0.9em'});
        var playerNick = $('<a></a>').text(data[items].playerName + " is playing as ").css({'text-align': 'left'});
        var playerCharacter = $('<a></a>').text(data[items].name).css({'color' : 'rgb(20, 152, 138)'});
        $(playerBar).append(playerNick, playerCharacter);
        $('#lobbyMenu').append(playerBar);
      }
    }
  });
  socket.on('lobbyCountDown', function(data){
      gameBeginTimer =  data.time;
      $('#lobbyTimer').text("Game starting in: " + gameBeginTimer);
  });

  socket.on('gameInit', function(data){
    console.log("Yeah this happens");
    deleteLobby();
    mainGame(data);
  });
}

//Remove lobbyMenu
function deleteLobby(){
  console.log("Should be removing lobby");
  $('.lobby').animate({
    'margin-top': '400',
      opacity: 0.0
  }, 800, function(){
    $(this).remove();
  });
}

//After join Game
function onJoin(){
  console.log("Connected to the Server.");
  socket = io();
  socket.emit('canJoin');
  socket.on('canJoin', function(data){
    if(data.joinable == true){
        if($('#inProg').length > 0){
          $('#inProg').remove();
        }
        $('#joinGameID').attr({hidden: true});//text('Leave Server').attr({onclick: 'onDisconnect()'});
        socket.emit('setupPlayer', {characterName: playerInfo.charName, characterID: playerInfo.charIdentity, playerName: $('#playerNameInput').val()});
    }else {
      //This is a stupid check but my other simple method didnt work :()
        if(!($('#inProg').length > 0)){
          $("html").prepend($("<div></div>").text("People are currently playing.").attr({class: "title", id: "inProg"}));
        }
        onDisconnect();
    }
  });

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
