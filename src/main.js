// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//说是es6 promoise 会用到这个
import 'babel-polyfill'
//rem 重置
import 'common/js/resize'
import 'common/scss/index.scss'

import Vue from 'vue'
import App from './App'
import router from './router/index'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store/index'

fastclick.attach(document.body);
Vue.config.productionTip = false;

Vue.use(VueLazyload, {
  preLoad: 1.3,
  //todo webpack会解析这里的路径 还是奇怪webpack的工作原理
  loading: require('common/image/default.png'),
  attempt: 1
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});
