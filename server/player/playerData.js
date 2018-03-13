exports.Player = (id, name, charID, nickName) => {
  var self = {
    id:id,
    name:name,
    characterID:charID,
    playerName: nickName,
    x:400,
    y:300,
    ctrlRight: false,
    ctrlLeft: false,
    acceleration:0.3,
    velocityX: 0,
    friction: 0.3,
    maxVelocityX: 6,
    canShoot: true,
    health: 3,
    mortal: true
  }
  self.updatePos = () => {
    if(self.ctrlRight && self.velocityX <= self.maxVelocityX){
      self.velocityX += self.acceleration;
    }
    else if(self.ctrlLeft && self.velocityX >= -self.maxVelocityX){
      self.velocityX -= self.acceleration;
    }
    else{
      if(self.velocityX > 0){
        self.velocityX -= self.friction;
      }
      if(self.velocityX < 0){
        self.velocityX += self.friction;
      }
      if(self.velocityX <= 0.9 && self.velocityX >= -0.9){
        self.velocityX = 0;
      }
    }
    self.x += self.velocityX;
  }
  self.setCanShoot = (value) => {
    self.canShoot = value;
  }
  self.takeDamage = () => {
    self.mortal = false;
    if (self.health != 0) {
      self.health--;
      if (self.health == 0) {
        self.die();
      }
    }
  }
  self.die = () => {
    console.log("Player " + self.id + " died.");
    //death stuff
  }
  return self;
}
