<!--这个组件是必须的，主要目的是getSingerDetail 接口与数据 可以再做一个更通用的music-list组件
3个数据一致 bg-image title songs
-->
<template>
  <transition name="slide">
    <music-list :bgImage="singer.avatar" :title="singer.name" :songList="songList"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import router from 'router/index'
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'class/Song'
  import MusicList from 'components/music-list/music-list'

  export default {
    data(){
      return {
        songList: []
      }
    },

    created(){
      this._getSingerDetail();
    },

    methods: {
      _getSingerDetail(){
        // 刷新之后数据就没了
        console.log(this.singer);
        if (!this.singer.id) {
          router.push('/singer');
          return;
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            res.data.list.forEach(item => this.songList.push(createSong(item)));
          }
          console.log(this.songList);
        });
      }
    },

    computed: {
      /**
       *相当于 singer(){
       * return this.$store.getters.singer
       * }
       */
      ...mapGetters([
        'singer'
      ])
    },

    components: {
      MusicList
    }

  }
</script>


<style rel="stylesheet/scss" lang="scss">
  @import "../../common/scss/variable";

  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s ease;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .slide-enter-to, .slider-leave {
    transform: translate3d(0, 0, 0);
  }
</style>
