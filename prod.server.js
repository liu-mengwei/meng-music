var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var port = process.env.PORT || config.build.port

var app = express()

var apiRoutes = express.Router()

//从一个jsonp中取出数据
var getDataFromJsonp = function (data) {
  //写一个正则取出json数据  func({'age':24})
  let reg = /^\w+\(({.+})\)$/;
  let matches = data.match(reg);

  let ret = '';
  if (matches) {
    ret = JSON.parse(matches[1]);
  }

  return ret;
};

//请求转发
apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(function (response) {
    res.json(response.data);
  }).catch(function (e) {
    console.log(e);
  })
});

apiRoutes.get('/getCdInfo', function (req, res) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data;
    if (typeof ret === 'string') {
      ret = getDataFromJsonp(ret);
    }
    res.json(ret);
  }).catch((e) => {
    console.log(e);
  })

});

apiRoutes.get('/getLyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';

  //多加了个y 你说蠢不蠢， 域名要一致啊
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    let ret = response.data;
    if (typeof ret === 'string') {
      ret = getDataFromJsonp(ret);
    }
    res.json(ret);
  }).catch(function (e) {
    console.log(e);
  })

});

app.use('/api', apiRoutes)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
});
