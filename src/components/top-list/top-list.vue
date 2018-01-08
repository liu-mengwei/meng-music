<template>
  <transition name="slide">
    <music-list
      :bgImage="bgImage"
      :title="topInfo.ListName"
      :rank="true"
      :songListProp="songList">
    </music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import router from 'router/index'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'class/Song'
  import MusicList from 'components/music-list/music-list'

  export default {
    data(){
      return {
        songList: [],
        topInfo: {}
      }
    },

    computed: {
      bgImage(){
        if (this.songList.length > 0) {
          return this.songList[0].image;
        } else {
          return '';
        }
      }
    },

    created(){
      this._getMusicList();
    },

    methods: {
      _getMusicList(){
        // 刷新之后数据就没了
        getMusicList(this.$route.params.topid).then((res) => {
          console.log(res);
          if (res.code === ERR_OK) {
            res.songlist.forEach(item => this.songList.push(createSong({musicData: item.data})));
            this.topInfo = res.topinfo;
          }
        });
      }
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
