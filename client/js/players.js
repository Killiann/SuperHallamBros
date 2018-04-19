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
var memetClass = new weaponClass(75, 600, 10, 0, 1.1, "projectileBall", "memet_player");
var pascalClass = new weaponClass(15, 400, 5, 75, 1,  "projectileBall", "default_player");
var mikeClass = new weaponClass(5, 500, 5, 50, 1,  "projectileBall", "mike_player");
var nannyClass = new weaponClass(15, 800, 5, 75, 1,  "projectileBall", "default_player");

//Class Sprite Sheets and states.
//var spriteSheets = [{},{},{},{}];

var classDetails = [memetClass, pascalClass, mikeClass, nannyClass];

function Character(id, characterID, nickName, playerDetails){
      this.id = id;
      this.char = characterID;
      this.nick = nickName;
      this.weaponData = classDetails[this.char - 1];
      this.entity =
      Crafty.e(this.id + ', 2D, Canvas, ' + this.weaponData.spriteSheet + ', SpriteAnimation, Gravity, Motion, Collision')
      .gravity('Ground')
      .attr({h: 60, w:40})
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
      this.jumping = 0;
      this.maxJump = 2;

      var playerBackground = Crafty.e('2D, Canvas, Color').attr({x: -15, y: -40, h:20, w:80}).color('rgb(70,70,70,0.2)');
      var playerTag = Crafty.e('2D, DOM, Text').text(this.nick).attr({x: -15, y: -37, h:20, w:80}).textColor('white').textAlign('center').textFont({size: '14px', family: "Bangers"});
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
        if (this.dead == false) {
          if (this.entity.attr().x > 720 || this.entity.attr().x < 0 || this.entity.attr().y > 720) {
            socket.emit('playerLeftMap', {playerID:this.id});
          }
        }

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
        if (this.entity.vy == 0) {
          this.jumping = 0;
        }
        if (this.jumping < this.maxJump) {
            this.entity.velocity().y -= 400;
            this.jumping += 1;
        }

      }
      this.fireWeaponAt = function(x, y){
        if (this.dead == false) {
          var weapon = this.weaponData;

          //Click positions
          var x1 = this.getX();
          var y1 = this.getY();
          var speed = 200;
          var length = Math.sqrt((x - x1)*(x - x1) + (y - y1)*(y - y1));

          //create projectile
          var projectile = Crafty.e(id + '_projectile, 2D, Canvas, Gravity, ' + weapon.image + ', SpriteAnimation, Motion, Collision').attr({x: x1, y: y1, w: 20, h: 20})
          .reel("spawn_projectile", 500, [[0, 0], [1, 0], [2, 0], [3, 0]]);

          //Shoot it
          projectile.vx = (x - x1) /length * weapon.speed;
          projectile.vy = (y - y1) /length * weapon.speed;

          projectile.animate("spawn_projectile", 1);

          //Collision with surfaces
          projectile.onHit('Ground', function(data){
            this.destroy();
            data[0].obj.destroy();
            createBreakParticle(data[0].obj.attr().x, data[0].obj.attr().y);
          });

          //Fire Rate - here we send data to the server soket telling it that the client has is about to shoot.
          //We will disable shooting on he server side of the player. Then we set a timer as long as their firerate is to
          //then allow them to shoot again once the timer is up.
          socket.emit('playerShooting', {canShoot: false});
          setTimeout(function(){
            socket.emit('playerShooting', {canShoot: true});
          }, weapon.fireRate);

          //Despawn after this timer
          setTimeout(function(){
            projectile.destroy();
          }, 10000);
        }

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
        createDeathParticle(this.getX(), this.getY());
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

function weaponClass(damage, speed, weight, fireRate, fireDrawback, projectileImage, spriteSheet){
  this.damage = damage;
  this.speed = speed;
  this.weight = weight;
  this.fireRate = fireRate;
  this.fireDrawback = fireDrawback;
  this.image = projectileImage;
  this.spriteSheet = spriteSheet;
}
