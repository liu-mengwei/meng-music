<template>
  <div class="music-list">
    <div class="title-wrapper">
      <!--hack方法 否则如果不包的话 省略号显示不出来-->
      <div id="musicList-title-container" class="title-container">
        <span id="musicList-title" class="title" v-html="title"></span>
      </div>
    </div>
    <span class="icon-back" @click="goBack()"></span>
    <div class="bg-image" ref="bgImage">
      <!--遮罩层-->
      <div class="filter" :style="getBgImage" ref="filter">
      </div>
      <div class="back"></div>
      <div class="play-container" v-show="songList.length>0" ref="playContainer"
           @touchstart="onPlayAllStart"
           @touchend="onPlayAllEnd">
        <span class="icon-play"></span>
        <span class="play-title">
          {{modeType}}播放全部<sub class="songList-num">/{{songList.length}}</sub>
        </span>
      </div>
    </div>
    <!--给外层设置高度-->
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll :data="songList" class="songs-wrapper" ref="list" :probeType="probeType" :listenScroll="listenScroll"
            @scroll="scroll" style="overflow:visible">
      <div class="songs-list-container" ref="songListContainer">
        <song-list :songList="songList"></song-list>
      </div>
      <div class="loading-container" v-if="songList.length == 0">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>


<script type="text/ecmascript-6">
  import SongList from 'components/song-list/song-list'
  import Scroll from 'base/scroll'
  import {getStyle, addClass, removeClass} from 'common/js/dom'
  import Loading from 'base/loading'
  import {mapGetters, mapActions} from 'vuex'
  import {modeType} from '../../store/config'
  import {miniPlayMixin, showMoreMixin} from '../../common/js/mixin'
  import $ from 'jquery'


  const titleHeight = 42;

  export default {
    mixins: [miniPlayMixin, showMoreMixin],
    props: {
      title: {
        type: String,
        default: ''
      },
      songList: {
        type: Array,
        default: []
      },
      bgImage: {
        type: String,
        default: ''
      }
    },

    data(){
      return {
        probeType: 3,
        listenScroll: true,
        imageHeight: 0
      }
    },

    created(){
      console.log('music-list组件创建');
    },

    mounted(){
      console.log('music-list组件渲染');

      this.imageHeight = this.$refs.filter.clientHeight;
      this.$refs.list.$el.style.top = `${this.imageHeight}px`;
      this.$refs.bgLayer.style.top = `${this.imageHeight}px`;

      this.$nextTick(() => {
        let el = this.getWrapperAndContent();
        this.startShowMoreAnimation(el);
      });
    },

    beforeDestroy(){
      console.log('music-list销毁');
    },

    destroyed(){
      console.log('music-list销毁');
      this.endShowMoreAnimation();
    },

    computed: {
      getBgImage(){
        console.log('this.bgImage' + this.bgImage);
        return `background-image: url(${this.bgImage})`
      },

      modeType(){
        return this.playMode === modeType.sequence ? '顺序' : '随机';
      },

      ...mapGetters(['playMode'])
    },

    methods: {
      getWrapperAndContent(){
        let contentEl = $('#musicList-title');
        let wrapperEl = $('#musicList-title-container');
        return {contentEl, wrapperEl};
      },

      goBack(){
        this.$router.go(-1);
      },

      scroll(pos){
        let style = getStyle('transform');

        if (-pos > this.imageHeight - titleHeight) {
          pos = -(this.imageHeight - titleHeight);
          this.$refs.bgImage.style.height = `${titleHeight}px`;
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.zIndex = 10;
          this.$refs.playContainer.style.display = 'none';
        } else {
          //恢复原状
          this.$refs.bgImage.style.height = 0;
          this.$refs.bgImage.style.paddingTop = '70%';
          this.$refs.bgImage.style.zIndex = 0;
          this.$refs.playContainer.style.display = 'block';
        }

        let scale = 1;
        let blur = 0;
        let ratio = Math.abs(pos / this.imageHeight);

        if (pos > 0) {
          this.$refs.bgImage.style[getStyle('transform')] = `scale(${1 + ratio})`;
          this.$refs.filter.style[getStyle('filter')] = '';

        } else if (pos < -20) {  //优化效果
          //越往上越模糊
          blur = Math.min(20, 20 * ratio);
          this.$refs.filter.style[getStyle('filter')] = `blur(${blur}px)`;
        }

        this.$refs.bgLayer.style.transform = `translate3d(0,${pos}px,0)`;
      },

      onPlayAllStart(){
        addClass(this.$refs.playContainer, 'active');
      },

      onPlayAllEnd(){
        removeClass(this.$refs.playContainer, 'active');
        let index = -1;
        if (this.playMode === modeType.sequence) {
          index = 0;
        } else {
          index = Math.floor(Math.random() * this.songList.length);
        }

        this.setPlayList({songList: this.songList, index});
      },

      handleMiniPlay(){
        if (this.playList.length > 0) {
          this.$refs.list.$el.style['bottom'] = '0.7rem';
          this.$refs.list.refresh()
        }
      },

      ...mapActions([
        'setPlayList'
      ])
    },

    components: {
      SongList,
      Scroll,
      Loading
    }
  }

</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../common/scss/variable";
  @import "../../common/scss/icon.css";
  @import "../../common/scss/mixin";

  .music-list {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: $color-background;

    .title-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 75%;
      margin: 0.12rem auto;
      z-index: 20;
      display: flex;

      /*todo
      *1.不设置flex无法超出父元素
      *2.inline不能设置transform属性
      *3.设置flex布局，不包一层container无法出现省略号 这里tm有三个坑*/
      .title-container {
        text-align: center;
        width: 100%;
        @include nowrap();

        .title {
          display: inline-block;
          text-align: center;
          font-size: $font-size-large;
        }
      }
    }

    .icon-back {
      color: $color-theme;
      position: absolute;
      top: 0.1rem;
      left: 0.1rem;
      font-size: $font-size-large-x;
      z-index: 20;
    }

    .bg-image {
      width: 100%;
      padding-top: 70%; //是相当于父元素宽度
      background-size: cover;
      position: relative;
      background-color: #333;
      overflow: hidden;

      .filter {
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        background-size: cover;
      }

      .back {
        position: absolute;
        left: 0;
      }

      .play-container {
        position: absolute;
        border: 1px solid $color-theme;
        border-radius: 20px;
        padding: 0.1rem 0.2rem;
        text-align: center;
        bottom: 0.2rem;
        left: 0;
        right: 0;
        width: 1.25rem;
        margin: 0 auto;
        transition: all 0.3s ease;

        &.active {
          background: $color-theme;

          .icon-play {
            color: #fff;
          }

          .play-title {
            color: #fff;
          }
        }

        .icon-play {
          color: $color-theme;
          margin-right: 0.02rem;
        }

        .play-title {
          color: $color-theme;

          .songList-num {
            vertical-align: text-bottom;
          }
        }
      }
    }

    .bg-layer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: #222;
    }

    .songs-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;

      .songs-list-container {
      }

      .loading-container {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
      }
    }
  }
</style>
