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
      this.getWeaponData = function(){
        return classDetails[this.char];
      }
      this.fireWeaponAt = function(x, y){
        let projectile = Crafty.e('Projectile, 2D, Canvas, Gravity, Color, Motion').attr({x: this.getX(), y: this.getY()});
        projectile.velocity().x += 300;
        setTimeout(function(){
          projectile.destroy();
        }, 10000);
      }
}

var classDetails = [memetClass, pascalClass, mikeClass, nannyClass];

var memetClass = new weaponClass(75, 10, 0, 1.1, 'rgb(79, 79, 79)');
var pascalClass = new weaponClass(15, 5, 75, 1, 'rgb(38, 38, 38)');
var mikeClass = new weaponClass(5, 0, 50, 1, 'rgb(208, 20, 144)');
var nannyClass = new weaponClass(15, 5, 75, 1, 'rgb(79, 79, 79)');

function weaponClass(damage, weight, fireRate, fireDrawback, projectileImage){
  this.damage = damage;
  this.weight = weight;
  this.fireRate = fireRate;
  this.fireDrawback = fireDrawback;
  this.image = projectileImage;
}
