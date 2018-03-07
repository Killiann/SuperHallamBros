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

//Class weapon attributes
var memetClass = new weaponClass(75, 8, 10, 0, 1.1, 'rgb(79, 79, 79)');
var pascalClass = new weaponClass(15, 5, 5, 75, 1, 'rgb(38, 38, 38)');
var mikeClass = new weaponClass(5, 3, 0, 50, 1, 'rgb(208, 20, 144)');
var nannyClass = new weaponClass(15, 8, 5, 75, 1, 'rgb(79, 79, 79)');

var classDetails = [memetClass, pascalClass, mikeClass, nannyClass];

console.log("Character ID: " + JSON.stringify(classDetails) + "\n");

function Character(id, characterID, nickName){
      this.id = id;
      this.char = characterID;
      this.nick = nickName;
      this.weaponData = classDetails[this.char - 1];
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
      this.fireWeaponAt = function(x, y){

        var weapon = this.weaponData;
        console.log(JSON.stringify(weapon));

        //Click positions
        var x1 = this.getX();
        var y1 = this.getY();
        var dy = y - y1;
        var dx = x - x1;

        //Fire Rate - here we send data to the server soket telling it that the client has is about to shoot.
        //We will disable shooting on he server side of the player. Then we set a timer as long as their firerate is to
        //then allow them to shoot again once the timer is up.
        socket.emit('playerShooting', {canShoot: false});
        setTimeout(function(){
          socket.emit('playerShooting', {canShoot: true});
        }, weapon.fireRate * 10);

        //create projectile
        var projectile = Crafty.e('2D, Canvas, Gravity, Color, Motion').attr({x: x1, y: y1, w: 10, h: 10}).color(weapon.image);

        //Shoot it
        projectile.vx = dx * weapon.speed;
        projectile.vy = dy * weapon.speed;

        //Despawn after this timer
        setTimeout(function(){
          projectile.destroy();
        }, 10000);
      }
}

function weaponClass(damage, speed, weight, fireRate, fireDrawback, projectileImage){
  this.damage = damage;
  this.speed = speed;
  this.weight = weight;
  this.fireRate = fireRate;
  this.fireDrawback = fireDrawback;
  this.image = projectileImage;
}
