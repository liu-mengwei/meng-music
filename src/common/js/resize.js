(function (document, window) {
  var doc = document.documentElement;

  //todo 为什事件属性会挂到window属性下
  //横屏竖屏确实是挂到window 下的
  var event = 'orientationchange' in window ? 'orientationchange' : 'resize';


  function resize () {
    //获取屏幕宽度
    var width = doc.clientWidth;

    //以iphone6 作为设计稿
    doc.style.fontSize = (width / 375) * 100 + 'px';
  }

  if (event === 'orientationchange') {
    window.addEventListener(event, resize, false);
  } else {
    doc.addEventListener(event, resize, false);
  }

  resize();
})(document, window);
