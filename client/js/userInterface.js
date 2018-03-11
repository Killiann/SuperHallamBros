function healthBar(id, nickName){
  this.barID = id;
  this.name = nickName;

  var userName = $('<p></p>').text(this.name);
  var heartHolder = $('<div></div>').attr({id: this.barID}).css({'float': 'left'});
  $(heartHolder).append(userName);

  for (var i = 0; i < 3; i++){
    var heartElement = $('<img>').attr({src: 'client/res/img/fullHeart.png', widht: 25, height: 25, id: this.barID + '_heathIcon_' + i});
    $(heartHolder).append(heartElement);
  }

  $('body').prepend(heartHolder);

  this.updateBar = function(health){
    var emptyHearts = 3 - health;
    for (var i = 0; i < emptyHearts; i++) {
      console.log(this.name + " shoukd have updated bar health");
      $(this.barID + '_heathIcon_' + i).attr({src: 'client/res/img/emptyHeart.png'});
    }
  }
}
