<template>
  <transition name="slide">
    <div class="user" v-show="showFlag">
      <div class="switch-wrapper">
        <switches :switches="switches" @selectTab="selectTab" :currentIndex="currentIndex"></switches>
      </div>
      <i class="icon-back" @click.stop="back"></i>
      <div class="play-container" :class="{'active': songList.length>0}">
        <span class="icon-play"></span>
        <span class="play-title" @click.stop="playAllList">
          播放全部<sub class="songList-num">/{{songList.length}}</sub>
      </span>
      </div>
      <div class="list-container" ref="listContainer">
        <scroll class="favourite-wrapper" ref="favouriteWrapper" v-show="currentIndex == 0" :data="favouriteList">
          <song-list :add="false"
                     :songList="favouriteList"
                     :insertPlayList="false"
                     :next="true"
                     :favourite="true"
                     @insertSong="insertSong"></song-list>
        </scroll>
        <scroll class="latest-wrapper" ref="latestWrapper" v-show="currentIndex == 1" :data="latestSongList">
          <song-list :add="false"
                     :songList="latestSongList"
                     :insertPlayList="false"
                     :next="true"
                     :favourite="true"
                     @insertSong="insertSong">
          </song-list>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll'
  import SongList from 'components/song-list/song-list'
  import {mapGetters, mapActions} from 'vuex'
  import {Song, wrapperToSongList} from 'class/Song'
  import {modeType} from '../../store/config'
  import {miniPlayMixin} from '../../common/js/mixin'

  export default {
    mixins: [miniPlayMixin],

    data(){
      return {
        switches: ['我喜欢的', '最近听的'],
        currentIndex: 0,
        showFlag: false
      }
    },

    created(){
      console.log('user组件创建');
    },

    destoryed(){
      console.log('user组件销毁')
    },

    methods: {
      selectTab(index){
        this.currentIndex = index;
      },

      back(){
        this.toggle();
      },

      playAllList(){
        let index = -1;
        if (this.playMode === modeType.sequence) {
          index = 0;
        } else {
          index = Math.floor(Math.random() * this.songList.length);
        }

        this.setPlayList({songList: this.songList, index});
      },

      insertSong(){
      },

      handleMiniPlay(){
        let bottom = 0;
        if (this.playList.length > 0) {
          bottom = '0.7rem';
        }
        this.$refs.listContainer.style['bottom'] = bottom;
        this.$refs.favouriteWrapper.refresh();
        this.$refs.latestWrapper.refresh();
      },

      toggle(){
        this.showFlag = !this.showFlag;
      },

      ...mapActions(['insertSongList', 'setPlayList'])
    },

    computed: {
      songList(){
        return this.currentIndex === 0 ? this.favouriteList : this.latestSongList;
      },

      ...mapGetters(['latestSongList', 'favouriteList'])
    },

    watch: {
      showFlag(){
        this.$nextTick(() => {
          this.$refs.favouriteWrapper.refresh();
          this.$refs.latestWrapper.refresh();
        });
      },

      currentIndex(index){
        this.$nextTick(() => {
          this.$refs.favouriteWrapper.refresh();
          this.$refs.latestWrapper.refresh();
        });
      }
    },

    components: {
      Switches,
      Scroll,
      SongList
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../common/scss/variable";

  .user {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: $color-background;
    z-index: 100;

    &.slide-enter, &.slide-leave-to {
      transform: translateX(100%);
    }

    &.slide-enter-to, &.slide-leave {
      transform: translateX(0);
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s ease;
    }

    .switch-wrapper {
      width: 70%;
      margin: 0.1rem auto;
      position: relative;
    }

    .icon-back {
      position: absolute;
      left: 0.15rem;
      top: 0.19rem;
      font-size: $font-size-large-x;
      color: $color-theme;
    }

    .play-container {
      border: 1px solid rgb(150, 150, 150);
      border-radius: 20px;
      padding: 0.1rem 0.08rem;
      text-align: center;
      width: 1.25rem;
      margin: 0.2rem auto;
      transition: all 0.3s ease;

      &.active {
        color: $color-theme;
        border-color: $color-theme;
      }

      .icon-play {
        vertical-align: middle;
        line-height: 0.18rem;
      }

      .play-title {
        line-height: 0.18rem;
        .songList-num {
          vertical-align: text-bottom;
        }
      }
    }

    .list-container {
      text-align: left;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      top: 1.2rem;

      .favourite-wrapper, .latest-wrapper {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
