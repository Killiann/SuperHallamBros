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
    maxSpd: 20
  }
  self.updatePos = () => {
    if (self.ctrlRight)
      self.x += self.maxSpd;
    if (self.ctrlLeft)
      self.x -= self.maxSpd;
  }
  return self;
}
