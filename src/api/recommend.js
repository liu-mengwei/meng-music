/**
 * Created by liumw on 2017/9/12.
 */
import jsonp from 'common/js/jsonp';
import {commonParam, options} from 'api/config';

export default function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  var param = Object.assign({}, commonParam, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  return jsonp(url, param, options);
}
