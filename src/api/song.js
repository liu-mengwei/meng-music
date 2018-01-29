import axios from 'axios'
import {commonParam, options} from 'api/config';
import {getUid} from 'common/js/uid'
import jsonp from 'common/js/jsonp'

export function getLyric(mid) {
  const url = '/api/getLyric';

  const data = Object.assign({}, commonParam, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  });

  return axios.get(url, {params: data}).then((res) => {
    return Promise.resolve(res.data);
  });
}

export function getVKey(songmid, filename) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';

  const data = Object.assign({}, commonParam, {
    cid: 205361747,
    format: 'json',
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    uin: 0,
    songmid,
    filename,
    guid: getUid()
  });

  return jsonp(url, data, Object.assign({}, options, {
    param: 'callback'
  }))
}
