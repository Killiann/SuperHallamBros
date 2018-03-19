function addPlayers(playerDetails){

  for (var p in playerDetails) {
    if (playerDetails.hasOwnProperty(p)) {

      //Init player model data
      PLAYER_ENTITIES[p] = new Character(p, playerDetails[p].characterID, playerDetails[p].playerName, playerDetails);

      //Create the entity by running this method
      PLAYER_ENTITIES[p].entity;

    }
  }
}

//Class weapon attributes
var memetClass = new weaponClass(75, 8, 10, 0, 1.1, 'rgb(237, 237, 237)');
var pascalClass = new weaponClass(15, 5, 5, 75, 1, 'rgb(38, 38, 38)');
var mikeClass = new weaponClass(5, 3, 0, 50, 1, 'rgb(208, 20, 144)');
var nannyClass = new weaponClass(15, 8, 5, 75, 1, 'rgb(204, 15, 15)');

var classDetails = [memetClass, pascalClass, mikeClass, nannyClass];

function Character(id, characterID, nickName, playerDetails){
      this.id = id;
      this.char = characterID;
      this.nick = nickName;
      this.weaponData = classDetails[this.char - 1];
      this.entity =
      Crafty.e(this.id + ', 2D, Canvas, walker_start, SpriteAnimation, Gravity, Motion, Collision')
      .gravity('Ground')
      .attr({h: 40, w:25})
      .gravityConst(1200)
      .ignoreHits(id + '_projectile')
      .reel("walkingRight", 250, [[0, 0], [1, 0], [2, 0], [3, 0],[0, 1], [1, 1]])
      .reel("walkingLeft", 250, [[3,2], [2,2], [1, 2], [0, 2], [3,3], [2,3]])
      .reel("staticRight", 1, [[1,1]])
      .reel("staticLeft", 1, [[2,3]]);
      this.dead = false;
      this.walkingRightAni = false;
      this.walkingLeftAni = false;
      this.jumpingAni = false;

      var playerBackground = Crafty.e('2D, Canvas, Color').attr({x: -15, y: -40, h:20, w:80}).color('rgb(70,70,70,0.2)');
      var playerTag = Crafty.e('2D, DOM, Text').text(this.nick + this.id).attr({x: -15, y: -37, h:20, w:80}).textColor('white').textAlign('center').textFont({size: '14px', family: "Bangers"});
      playerBackground.attach(playerTag);
      this.entity.attach(playerBackground);

      //create health bar
      this.healthUI = new healthBar(this.id, this.nick);

      this.setColour = function(colour){
        this.entity.color(colour);
      }
      this.updateX = function(x, mouseX){
        var that = this;
        if (mouseX > x && x != this.entity.attr().x && this.walkingRightAni == false) {
          this.walkingRightAni = true;
          this.entity.animate("walkingRight", 1);
          setTimeout(function(){
            that.walkingRightAni = false;
          }, 500);
        }else if(mouseX > x && x == this.entity.attr().x && this.walkingRightAni == false) {
          this.entity.animate("staticRight", 1);
        }

        if (x != this.entity.attr().x && x > mouseX && this.walkingLeftAni == false) {
          this.walkingLeftAni = true;
          this.entity.animate("walkingLeft", 1);
          setTimeout(function(){
            that.walkingLeftAni = false;
          }, 500);
        }else if(x == this.entity.attr().x && x > mouseX && this.walkingLeftAni == false){
          this.entity.animate("staticLeft", 1);
        }

        this.entity.attr({x: x});
      }
      this.updateY = function(y){
        if (y > 720) {
          this.entity.attr({y: -100});
        }else {
          this.entity.attr({y: y});
        }

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
        }, weapon.fireRate);

        //create projectile
        var projectile = Crafty.e(id + '_projectile, 2D, Canvas, Gravity, Color, Motion').attr({x: x1, y: y1, w: 10, h: 10}).color(weapon.image);

        //Shoot it
        projectile.vx = dx;
        projectile.vy = dy;

        //Despawn after this timer
        setTimeout(function(){
          projectile.destroy();
        }, 10000);
      }
      this.onDamage = function(health){
        this.healthUI.updateBar(health);
        this.entity.alpha = 0.5;
        var that = this;

        var flash = setInterval(function(){
          that.entity.alpha = 1.0;
          var dash = setTimeout(function(){
            that.entity.alpha = 0.5;
          }, 250);
        }, 600);

        setTimeout(function(){
          clearInterval(flash);
          that.entity.alpha = 1.0;
          socket.emit('playerMortal', {playerID: that.id});
        }, 1500);

      }

      this.die = function(){
        this.entity.destroy();
        this.dead = true;
        checkForGameOver();
      }

      //collsion stuff

      for (var key in playerDetails) {

        if (playerDetails.hasOwnProperty(key) && key != id) {
          //console.log("Adding hit detection for " + id + " \n on hit with " + key);
            this.entity.onHit(key + '_projectile', function(data){

              //  console.log("Player with id:\n" + key + " just hit player with id: \n" + id);

                socket.emit('playerHit', {playerID: id});
                data[0].obj.destroy();

            });
          }
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
