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
    let title = $('<div></div>').addClass('title').text('Join Game');
    let content = $('<div></div>').addClass('content').text('Where the current players that are about to start a game go.');

    //Game selection content goes here, append to content


    $(backing).append(title, content);
    return backing;
};


var playerInfo = {
  charIdentity : null,
  charName : "Character not Selected",
  init : function(){
    let backing = $('<div></div>').addClass('title').text('You:');
    let hdnID = $('<input></input>').attr({value : this.charIdentity, hidden: true, id: 'charIDInput'});
    let nameField = $('<input></input>').attr({value: this.charName, id: 'charNameInput', readonly: true}).addClass('inputBox');
    $(backing).append(hdnID, nameField);
    return backing;
  },
  update : function(){
    $('#charIDInput').attr({value : this.charIdentity});
    $('#charNameInput').attr({value : this.charName});
  },
  //Getters and Setters
  setCharName : function(name){this.charName = name;},
  getCharName : function(){return this.charName;},
  setCharID : function(characterId){this.charIdentity = characterId;},
  getCharID : function(){return this.charIdentity;}
}

var characterButton = function(charID, name, image){

    this.init = function(){
      let base = $('<div></div>').addClass('lobbyCharButton').css({background : image, id : 'charButton_' + charID}).text(name);
      $(base).click(function(){
        console.log("Clicked character " + charID);
        playerInfo.charIdentity = charID;
        playerInfo.charName = name;
        playerInfo.update();
      });
      return base;
    }
};
