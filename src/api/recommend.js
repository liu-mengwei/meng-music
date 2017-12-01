/**
 * Created by liumw on 2017/9/12.
 */
import jsonp from 'common/js/jsonp';
import {commonParam, options} from 'api/config';
import axios from 'axios';

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  var param = Object.assign({}, commonParam, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  return jsonp(url, param, options);
}

//歌单列表
export function getDiscList() {
  const url = '/api/getDiscList';

  const data = Object.assign({}, commonParam, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });

  //这两个return是什么鬼
  return axios.get(url, {params: data}).then(function (res) {
    //返回一个Promise对象 返回数据
    return Promise.resolve(res.data);
  });
}

export function getSongList(disstid) {
  const url = '/api/getCdInfo';

  const data = Object.assign({}, commonParam, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  });

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data);
  })
}

