function healthBar(id, nickName){
  this.barID = id;
  this.name = nickName;
  this.hearts = [];

  var userName = $('<p></p>').text(this.name).addClass('heartName');
  var heartHolder = $('<div></div>').attr({id: this.barID}).css({'float': 'left', 'margin' : '10px'}); //can we design a css class for the hearts please.
  $(heartHolder).append(userName);

  for (var i = 0; i < 3; i++){
    this.hearts[i] = $('<img>').attr({src: 'client/res/img/fullHeart.png', width: 30, height: 30, id: this.barID + '_healthIcon_' + i});
    $(heartHolder).append(this.hearts[i]);
  }

  $('body').prepend(heartHolder);

  this.updateBar = function(health){
    var emptyHearts = 3 - health;
    for (var i = 0; i < emptyHearts; i++) {
      var that = this;
      $(this.hearts[i]).attr({src: 'client/res/img/emptyHeart.png'}).animate({
        width: '22px',
        height: '22px'
      }, 1000);
    }
  }
}
