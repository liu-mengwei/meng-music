<template>
  <div class="singer-wrapper">
    <listview class="singer" :data="singerList" @selectItem="selectSinger"></listview>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import Singer from 'class/Singer'
  import Listview from 'base/listview'
  import SingerDetail from '../singer-detail/singer-detail'
  import router from '../../router/index'
  import {mapMutations} from 'vuex'

  const HOT_NAME = '热门';
  const HOT_LENTH = 10;

  export default {
    data() {
      return {
        singerList: []
      };
    },

    created() {
      this._getSingerList();
    },

    methods: {
      //监听选择歌手的事件
      selectSinger(singer) {
        router.push(`/singer/${singer.id}`);
        this.setSinger(singer);
      },

      _getSingerList() {
        getSingerList().then((res) => {
          this.singerList = this._normalLize(res.data.list);
        });
      },

      //格式化数据
      //{hot:{title:'热门',items:[singerid:..]}}
      _normalLize(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        };

        //数据归并
        list.forEach(function (item, index) {
          //热门列表
          if (index < 10) {
            map.hot.items.push(new Singer(item.Fsinger_mid, item.Fsinger_name));
          } else {
            //如果不存在 就加一个
            if (!map[item.Findex]) {
              map[item.Findex] = {
                title: item.Findex,
                items: []
              };
            } else {
              map[item.Findex].items.push(new Singer(item.Fsinger_mid, item.Fsinger_name));
            }
          }
        });

        //排序map
        let hot = [];
        let ret = [];

        for (var key in map) {
          var item = map[key];
          if (/[a-zA-Z]/.test(item.title)) {
            ret.push(item);
          } else if (item.title === HOT_NAME) {
            hot.push(item);
          }
        }

        ret.sort(function (item1, item2) {
          //大的排后面
          return item1.title.charCodeAt(0) - item2.title.charCodeAt(0);
        });

        ret = hot.concat(ret);

        return ret;
      },

      //展开运算符 这里引入vuex的目的 就是跨组件数据传递
      //语法糖 相当于setSinger(){
      //  this.$store.commit('SET_SINGER')
      // }
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },

    components: {
      Listview,
      SingerDetail
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .singer-wrapper {
    position: fixed;
    top: 0.9rem;
    bottom: 0;
    width: 100%;
    overflow: hidden;

    .singer {
      width: 100%;
      height: 100%;
    }
  }
</style>

