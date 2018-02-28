function addPlayers(playerDetails){

  for (var p in playerDetails) {
    if (playerDetails.hasOwnProperty(p)) {

      //Init player model data
      PLAYER_ENTITIES[p] = new Character(p, playerDetails[p].characterID, playerDetails[p].playerName);

      //Create the entity by running this method
      PLAYER_ENTITIES[p].entity;

    }
  }


}

function Character(id, characterID, nickName){
      this.id = id;
      this.char = characterID;
      this.nick = nickName;
      this.entity = Crafty.e(this.id + ', 2D, Canvas, Gravity, Color, Motion').color('rgb(78, 78, 78)').gravity('Ground').attr({h: 80, w:50});

      var playerBackground = Crafty.e('2D, Canvas, Color').attr({x: -15, y: -40, h:20, w:80}).color('rgb(70,70,70,0.2)');
      var playerTag = Crafty.e('2D, DOM, Text').text(this.nick).attr({x: -15, y: -37, h:20, w:80}).textColor('white').textAlign('center').textFont({size: '14px', family: "Bangers"});
      playerBackground.attach(playerTag);
      this.entity.attach(playerBackground);

      this.setColour = function(colour){
        this.entity.color(colour);
      }
      this.updateX = function(x){
        this.entity.attr({x: x});
      }
      this.updateY = function(y){
        this.entity.attr({y: y});
      }
      this.getX = function(){
        return this.entity.attr().x;
      }
      this.getY = function(){
        return this.entity.attr().y;
      }
      this.jump = function(){
        this.entity.velocity().y -= 300;
      }
}
