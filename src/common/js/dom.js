// 通用dom 封装
export function addClass(el, className) {
  if (!hasClass(el, className)) {
    el.className += ' ' + className;
  }
}

export function hasClass(el, className) {
  var reg = new RegExp('(^|\\s)' + className + '($|\\s)');
  return reg.test(el.className);
}

export function removeClass(el, className) {
  if (hasClass(el, className)) {
    var reg = new RegExp('(^|\\s)' + className + '($|\\s)');
    el.className = el.className.replace(reg, '');
  }
}


export function getData(el, name, val) {
  const prefix = 'data-';

  let attr = prefix + name;
  if (val) {
    el.setAttribute(attr, val);
  } else {
    return el.getAttribute(attr);
  }
}

//单位换算
export function getPx(value) {
  return value * Number(document.documentElement.style.fontSize.replace('px', ''));
}


//浏览器检测
let vendor = (function () {
  let div = document.createElement('div');
  let transformNames = {
    'webkit': 'webkitTransform',
    'O': 'OTransform',
    'ms': 'msTransform',
    'Moz': 'MozTransform',
    'standard': 'transform'
  };

  for (let key in transformNames) {
    let item = transformNames[key];
    if (div.style[item] !== undefined) {
      return key;
    }
  }

  //错误情况
  return false;
})();


export function getStyle(style) {
  if (vendor === false) {
    return false;
  }

  if (vendor !== 'standard') {
    return vendor + style.charAt(0).toUpperCase() + style.substring(1);
  } else {
    return style;
  }
}

//触摸反馈
export function touchFeedBack(target) {
  target.style.background = 'rgba(100, 100, 100, 0.3)';
  target.style.transition = 'all 0.2s ease';

  setTimeout(() => {
    target.style.background = '';
  }, 200);
}

//时间补0,默认补两位
export function pad(time, n = 2) {
  time = time.toString();
  let i = time.length;
  while (i++ < n) {
    time = '0' + time;
  }
  return time;
}
