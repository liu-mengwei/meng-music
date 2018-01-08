export function debounce(func, delay) {

  let timer;
  //这是一个闭包
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      console.log(this);
      func.apply(this, args);
    }, delay);
  };
}
