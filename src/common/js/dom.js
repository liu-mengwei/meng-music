// 通用dom 封装
export function addClass(el, className) {
  if (!hasClass(el, className)) {
    if (el.className) {
      el.className += className;
    } else {
      el.className += ' ' + className;
    }
  }
}

export function hasClass(el, className) {
  var reg = new RegExp('(^|\\s)' + className + '($|\\s)');
  return reg.test(el.className);
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
