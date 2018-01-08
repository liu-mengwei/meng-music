<template>
  <transition name="slide">
    <music-list :bgImage="disc.imgurl" :title="disc.dissname" :songListProp="songList"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import router from 'router/index'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend'
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
      this._getDiscSongList();
    },

    methods: {
      //获取推荐歌单
      _getDiscSongList(){
        // 刷新之后数据就没了
        if (!this.disc.dissid) {
          router.push('/recommend');
          return;
        }
        getSongList(this.disc.dissid).then((res) => {
          console.log('res' + res);
          if (res.code === ERR_OK) {
            res.cdlist[0].songlist.forEach(item => this.songList.push(createSong({musicData: item})));
          }
        });
      }
    },

    computed: {
      ...mapGetters([
        'disc'
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
