<template>
  <transition name="slide">
    <div class="add-songs" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close">
          <span class="icon-close" @click="close"></span>
        </div>
      </div>
      <div class="searchBox-wrapper">
        <search-box ref="searchBox" placeHolder="搜索歌曲" @query="onQuery" @clearQuery="clearQuery"></search-box>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @selectTab="selectTab"></switches>
      </div>
      <div class="list-container">
        <scroll class="latest-wrapper" :data="latestSongList" ref="latestSongListScroll"
                v-show="currentIndex == 0 && !showSuggest">
          <song-list :add="false" :songList="latestSongList" :insertPlayList="true" @insertSong="showTopTip">
          </song-list>
        </scroll>
        <scroll class="search-list-wrapper" v-show="currentIndex == 1 && !showSuggest" :data="searchHistoryList"
                ref="searchHistoryListScroll">
          <search-list :searchList="searchHistoryList" @removeSearch="remove" @selectHistory="selectHotKey">
          </search-list>
        </scroll>
        <div class="suggest-wrapper" v-show="showSuggest">
          <suggest
            ref="suggest"
            :query="query"
            :insertPlayList="true"
            @select="insertSearchHistory"
            @insertSong="showTopTip"
            @beforeScrollStart="inputBlur"
            :showSinger="false">
          </suggest>
        </div>
      </div>
      <top-tip class="top-tip" ref="topTip">
        <div class="tip-wrapper">
          <span class="icon-ok"></span>
          <span>歌曲已经添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'components/search-box/search-box'
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll'
  import SongList from 'components/song-list/song-list'
  import SearchList from 'base/search-list/search-list'
  import Suggest from 'components/suggest/suggest'
  import {mapGetters, mapActions} from 'vuex'
  import {searchMixin} from 'common/js/mixin'
  import TopTip from 'base/top-tip/top-tip';

  export default {
    mixins: [searchMixin],

    data(){
      return {
        showFlag: false,
        switches: ['最近播放', '搜索历史'],
        currentIndex: 0,
        showSuggest: false
      }
    },

    methods: {
      toggle(){
        this.showFlag = !this.showFlag;
      },

      selectTab(index){
        this.currentIndex = index;
        this.showSuggest = false;
      },

      close(){
        this.toggle();
      },

      clearQuery(){
        this.showSuggest = false;
      },

      showTopTip(){
        this.$refs.topTip.show();
      }
    },

    computed: {
      ...mapGetters(['latestSongList', 'searchHistoryList'])
    },

    watch: {
      currentIndex(){
        setTimeout(() => {
          this.$refs.latestSongListScroll.refresh();
          this.$refs.searchHistoryListScroll.refresh();
        }, 20);
      },

      showFlag(){
        setTimeout(() => {
          this.$refs.latestSongListScroll.refresh();
        });
      },

      query(val){
        if (val) {
          this.showSuggest = true;
        }
        setTimeout(() => {
          this.$refs.suggest.refresh();
        }, 20);
      }
    },

    components: {
      SearchBox,
      Switches,
      Scroll,
      SongList,
      SearchList,
      Suggest,
      TopTip
    }
  }

</script>


<style rel="stylesheet/scss" scoped lang="scss">
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .add-songs {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 500;
    background: $color-background;

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s ease;
    }

    &.slide-enter, &.slide-leave-to {
      transform: translateX(100%);
    }

    &.slide-enter-to, &.slide-leave {
      transform: translateX(0%);
    }

    .header {
      position: relative;
      height: 0.5rem;
      text-align: center;
      color: $color-theme;

      .title {
        line-height: 0.5rem;
        font-size: $font-size-medium-x;
      }
      .close {
        position: absolute;
        top: 50%;
        right: 0.15rem;
        transform: translateY(-50%);
        font-size: $font-size-large;
      }
    }

    .searchBox-wrapper {
      width: 100%;
      margin: 0.1rem 0;
      padding: 0 0.2rem;
      box-sizing: border-box;
    }

    .switches-wrapper {
      width: 50%;
      margin: 0.2rem auto 0.1rem;
    }

    .list-container {
      position: absolute;
      left: 0;
      right: 0;
      top: 1.8rem;
      bottom: 0;

      .latest-wrapper, .suggest-wrapper, .search-list-wrapper {
        height: 100%;
        width: 100%;
      }
    }

    .top-tip {
      .tip-wrapper {
        height: 0.5rem;
        line-height: 0.5rem;
        text-align: center;

        .icon-ok {
          color: $color-theme;
        }
      }
    }
  }

</style>
