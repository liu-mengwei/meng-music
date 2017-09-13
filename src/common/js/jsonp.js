/**
 * promise 封装jsop
 * 现在这种文件 都不用写闭包了？
 * 遵从es6 导入导出规范 貌似并不会影响全局变量
 * */

import jsonpOrigin from 'jsonp'

/**
 * @param url
 * @param {Object} param 查询参数
 * @param opts 配置参数
 */
export default function (url, paramObj, opts) {
  //没有问号拼接一个问号
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(paramObj);

  return new Promise(function (resolve, reject) {
    //用法就是这样的,第一个参数是err,第二个参数是data
    jsonpOrigin(url, opts, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  //不用promise的写法
  //jsonpOrigin(url, opts, function (err, data) {
  //  if (err) {
  //    callback1(err);
  //  }else{
  //    callback2(data);
  //  }
  //})
}

//参数化对象
function param(paramObj) {
  var paramUrl = '';

  if (typeof paramObj === 'object') {
    for (var key in paramObj) {

      //只遍历自己的属性
      if (paramObj.hasOwnProperty(key)) {
        //不能传一个undefined 给服务端
        paramObj[key] = paramObj[key] === undefined ? '' : paramObj[key];
        paramUrl += '&' + key + '=' + encodeURIComponent(paramObj[key]);
      }
    }
  }

  //截掉第一个&
  return paramUrl.substring(1);
}
