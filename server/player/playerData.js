exports.Player = (id, name, charID, nickName) => {
  var self = {
    id:id,
    name:name,
    characterID:charID,
    playerName: nickName
  }
  return self;
}
