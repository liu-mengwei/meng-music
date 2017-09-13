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

