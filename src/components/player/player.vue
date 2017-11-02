<template>
  <div class="player">
    <!--主界面-->
    <!--貌似必须配合相应的类 否则不能生效-->
    <transition name="main"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="player-main" v-show="songList.length > 0 && fullScreen">
        <div class="bg-image" :style="getBgImage"></div>
        <!--不能写在里头 要不然就给滤掉了-->
        <div class="main-content">
          <div class="main-top">
            <span class="icon-back" @click="back()"></span>
            <h1 class="song-name" v-html="currentSong.name"></h1>
            <h2 class="song-singer" v-html="currentSong.singer"></h2>
          </div>
          <div class="main-middle">
            <!--必须得包一层吗-->
            <!--距离是需要计算出来的 所以必须用js钩子-->
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="container" :class="cdCls">
                <img class="cd-image" :src="currentSong.image">
              </div>
            </div>
          </div>
          <div class="main-bottom">
            <div class="operators">
              <div class="icon icon-sequence"></div>
              <div class="icon icon-prev" :class="disabledCls" @click="prev"></div>
              <div class="icon playBtn" :class="[disabledCls,playCls]" @click="togglePlay"></div>
              <div class="icon icon-next" :class="disabledCls" @click="next"></div>
              <div class="icon icon-favorite"></div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--下面的播放条-->
    <div class="player-mini" @click.stop="unfold" v-show="!fullScreen && songList.length > 0">
      <div class="mini-cd" ref="miniCd" :class="cdCls">
        <img class="cd-image" :src="currentSong.image">
      </div>
      <div class="mini-content">
        <div class="progressBar"></div>
        <div class="mini-bottom">
          <div class="singer-info">
            <!--为了分开省略号的显示 必须包一层-->
            <div class="songName-wrapper">
              <span class="mini-songName" v-html="currentSong.name"></span>
            </div>
            <div class="singer-wrapper">
              <span class="mini-singer" v-html="currentSong.singer"></span>
            </div>
          </div>
          <div class="operators">
            <span class="icon playBtn" @click.stop="togglePlay" :class="playCls"></span>
            <span class="icon icon-next" @click.stop="next"></span>
            <span class="icon-playlist"></span>
          </div>
        </div>
      </div>
    </div>
    <audio ref="audio" :src="currentSong.url" @canplay="canplay" @error="error"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {getPx, getStyle} from '../../common/js/dom'
  import $ from 'jquery';
  import {modeType} from '../../store/config'

  const transform = getStyle('transform');
  const transition = getStyle('transition');
  const animation = getStyle('animation');

  export default {
    data(){
      return {
        musicReady: false,
        backStatus: false,
        beforeIndexArr: []
      }
    },

    computed: {
      getBgImage(){
        return `background-image:url(${this.currentSong.image})`
      },

      //播放图表样式
      playCls(){
        return this.playing ? 'icon-pause' : 'icon-play';
      },

      cdCls(){
        return this.playing ? 'rotate' : 'rotate pause';
      },

      disabledCls(){
        return this.musicReady ? '' : 'disabled';
      },
      ...mapGetters(['fullScreen', 'songList', 'currentSong', 'playing', 'playMode', 'currentIndex'])
    },

    methods: {
      //获取偏移位置
      back(){
        this.setFullScreen(false);
      },

      unfold(){
        this.setFullScreen(true);
      },

      enter(el, done){
        //分别算出x,y的偏移距离
        const {x, y, scale} = this._getPos();

        let animation = {
          0: {
            transform: `translate3d(${-x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `scale(1)`
          }
        };

        //设置动画
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        });

        animations.runAnimation(this.$refs.cdWrapper, 'move', done);
      },

      afterEnter(){
        animations.unregisterAnimation('move');
      },

      leave(el, done){
        const {x, y, scale} = this._getPos();

        //兼容性处理
        this.$refs.cdWrapper.style[transform] = `translate3d(${-x}px,${y}px,0) scale(${scale})`;
        this.$refs.cdWrapper.style[transition] = 'all 0.4s'

        this.$refs.cdWrapper.addEventListener('transitionend', done);
      },

      afterLeave(){
        this.$refs.cdWrapper.style[transform] = '';
        this.$refs.cdWrapper.style[transition] = '';
      },

      //切换播放
      togglePlay(){
        if (!this.musicReady) {
          return;
        }

        this.setPlaying(!this.playing);
      },

      //前一首
      prev(){
        //歌曲未准备好时
        if (!this.musicReady) {
          return;
        }

        //往回切的时候不能入栈
        this.backStatus = true;

        let index = -1;
        //如果不存在的话 按照模式播放
        if (this.beforeIndexArr.length <= 0) {

          switch (this.playMode) {
            case modeType.sequence:
              //退回最后一首
              //这里不能用--,不然的话就直接赋值了
              index = (this.currentIndex - 1) < 0 ? this.songList.length - 1 : (this.currentIndex - 1);
              break;
            case modeType.random:
              index = Math.floor(Math.random() * this.songList.length);
              break;
            case modeType.loop:
              index = this.currentIndex;
              break;
          }

        } else { //上一首始终是上一次播放过的歌曲 得维护一个播放过歌曲的列表
          index = this.beforeIndexArr.pop();
        }

        this.setCurrentIndex(index);
        this.setPlaying(true);
        this.musicReady = false;
      },

      next(){
        if (!this.musicReady) {
          return;
        }

        this.backStatus = false;

        let index = -1;
        switch (this.playMode) {
          case modeType.sequence:
            index = (this.currentIndex + 1) === this.songList.length ? 0 : (this.currentIndex + 1);
            break;
          case modeType.random:
            index = Math.floor(Math.random() * this.songList.length);
            break;
          case modeType.loop:
            index = this.currentIndex;
            break;
        }

        this.setCurrentIndex(index);
        this.setPlaying(true);
        this.musicReady = false;
      },

      //计算动画所需要的数值
      _getPos(){
        let cdWidth = $('.cd-wrapper').width();
        let cdOffsetY = window.innerHeight - ($('.cd-wrapper').offset().top + cdWidth / 2);
        let cdOffsetX = $('.cd-wrapper').offset().left + cdWidth / 2;

        let miniWidth = $('.mini-cd').width();
        let miniOffsetY = getPx(0.47);
        let miniOffsetX = getPx(0.44);

        let transformY = cdOffsetY - miniOffsetY;
        let transformX = cdOffsetX - miniOffsetX;
        let scale = miniWidth / cdWidth;
        return {x: transformX, y: transformY, scale: scale}
      },

      //可以播放
      canplay(){
        this.musicReady = true;
      },

      //音乐获取失败
      error(){
        this.musicReady = true;
      },

      ...mapMutations({
        'setFullScreen': 'SET_FULLSCREEN',
        'setPlaying': 'SET_PLAYING',
        'setCurrentIndex': 'SET_CURRENT_INDEX'
      }),

      //歌曲名是否超过长度 true为超过了长度
      _getminiSongWidth(){
        let songWidth = $('.mini-songName').width();
        let wrapperWidth = $('.songName-wrapper').width();
        return {songWidth, wrapperWidth};
      },

      _startShowMoreAnimation(songWidth, wrapperWidth){
        setTimeout(function () {
          $('.songName-wrapper').css('text-overflow', 'inherit');
        }, 2000);

        let timeRatio = (songWidth + wrapperWidth) / songWidth;
        let step1 = {
          0: {
            transform: `translateX(0)`
          },
          100: {
            transform: `translateX(${-songWidth}px)`
          }
        };

        let step2 = {
          0: {
            transform: `translateX(${wrapperWidth}px)`
          },
          100: {
            transform: `translateX(${-songWidth}px)`
          }
        };
        //设置动画
        animations.registerAnimation({
          name: 'step1',
          animation: step1,
          presets: {
            delay: 2000,
            duration: 10000,
            easing: 'linear'
          }
        });
        animations.registerAnimation({
          name: 'step2',
          animation: step2,
          presets: {
            duration: 10000 * timeRatio,
            easing: 'linear',
            iterations: 'infinite'
          }
        });

        animations.runAnimation($('.mini-songName'), 'step1', function () {
          animations.runAnimation($('.mini-songName'), 'step2');
        });
      },

      _endShowMoreAnimation(){
        animations.unregisterAnimation('step1');
        animations.unregisterAnimation('step2');
        $('.songName-wrapper').css('text-overflow', 'ellipsis');
      }
    },

    watch: {
      currentSong(newVal, oldVal){
        this.$nextTick(() => {
          //记录这次播放的歌曲
          this.beforeSong = this.oldVal;
          this.$refs.audio.play();

          let {songWidth, wrapperWidth} = this._getminiSongWidth();
          //切歌后先终止之前的动画
          this._endShowMoreAnimation();

          if (wrapperWidth < songWidth) {
            this._startShowMoreAnimation(songWidth, wrapperWidth);
          }
        });
      },

      currentIndex(newVal, oldVal){
        if (oldVal !== -1 && !this.backStatus) {
          this.beforeIndexArr.push(oldVal);
        }
      },

      playing(){
        const audio = this.$refs.audio;

        this.$nextTick(function () {
          this.playing ? audio.play() : audio.pause();
        });
      },

      //歌名过长时做一个移动动画
      fullScreen(fullScreen){

        this.$nextTick(() => {
          //判断歌名是否超过了长度
          let {songWidth, wrapperWidth} = this._getminiSongWidth();
          if (wrapperWidth >= songWidth) {
            this._endShowMoreAnimation();
            return;
          }

          //不是全屏的情况下
          if (!fullScreen) {
            this._startShowMoreAnimation(songWidth, wrapperWidth);
          } else {
            this._endShowMoreAnimation();
          }
        })
      }

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .player {

    .main-enter, .main-leave-to {
      opacity: 0;

      .main-top {
        transform: translate3d(0, -0.56rem, 0);
      }

      .main-bottom {
        transform: translate3d(0, 0.8rem, 0);
      }
    }

    .main-enter-to, .main-leave {
      opacity: 1;

      .main-top {
        transform: translate3d(0, 0, 0);
      }

      .main-bottom {
        transform: translate3d(0, 0, 0);
      }

    }

    .main-enter-active, .main-leave-active {
      transition: all 0.4s ease;

      .main-top, .main-bottom {
        transition: all 0.4s cubic-bezier(.18, .72, 0, 1.51);
      }
    }

    .player-main {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: #333;
      z-index: 100;

      .bg-image {
        width: 100%;
        height: 100%;
        filter: blur(40px);
        background-size: cover;
        background-position: center;
      }

      .main-content {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;

        .main-top {
          text-align: center;
          margin-top: 0.1rem;
          margin-bottom: 0.3rem;
          position: relative;

          .icon-back {
            position: absolute;
            left: 0.15rem;
            top: 0;
            transform: rotate(-90deg);
            font-size: $font-size-large-x;
            color: $color-theme;
          }

          .song-name {
            max-width: 75%;
            font-size: $font-size-large;
            padding-top: 0.05rem;
            margin: 0 auto 0.15rem;
            @include nowrap();
          }

          .song-singer {
            max-width: 75%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin: 0 auto;
            @include nowrap();
          }
        }

        .main-middle {
          /*等比例*/
          width: 100%;
          padding-top: 80%;
          position: relative;

          .cd-wrapper {
            position: absolute;
            width: 80%;
            height: 100%;
            margin: 0 auto;
            top: 0;
            left: 0;
            right: 0;
            border-radius: 50%;
            border: 10px solid hsla(0, 0%, 100%, .1);
            overflow: hidden;

            .container {
              border-radius: 50%;
              overflow: hidden;

              .cd-image {
                width: 100%;
                height: 100%;
              }
            }
          }
        }

        .main-bottom {
          position: absolute;
          bottom: 0.4rem;
          width: 100%;

          .operators {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 0 0.35rem;

            .icon {
              font-size: 0.32rem;
              color: $color-theme;
            }

            .playBtn {
              font-size: 0.6rem;
            }
          }
        }
      }
    }

    .player-mini {
      position: absolute;
      bottom: 0;
      width: 100%;
      background: #333;
      height: 0.6rem;
      z-index: 100;
      display: flex;
      box-shadow: 0 -2px 2px 3px rgba(17, 21, 25, 0.4);

      .mini-cd {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid rgba(31, 27, 27, 0.8);
        position: relative;
        bottom: 0.13rem;
        left: 0.1rem;
        flex: 0 0 auto;

        .cd-image {
          width: 100%;
          border-radius: 50%;
          overflow: hidden;
        }
      }

      .mini-content {
        margin-left: 0.2rem;
        flex: 1 1 auto;

        .progressBar {
          margin-bottom: 0.15rem;
        }

        .mini-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-right: 0.15rem;

          .singer-info {
            flex: 1 1 auto;
            max-width: 1.5rem;

            .songName-wrapper {
              width: 100%;
              @include nowrap();
              .mini-songName {
                display: inline-block;
                margin-bottom: 0.02rem;
              }
            }

            .singer-wrapper {
              width: 100%;
              @include nowrap();
              .mini-singer {
                color: $color-text-d;
                font-size: $font-size-small;
              }
            }
          }

          .operators {
            flex: 1 0 auto;
            font-size: 0.25rem;
            color: $color-theme;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .playBtn {
              font-size: 0.3rem;
            }

            .icon-next {
              margin-left: 0.15rem;
            }

            .icon-playlist {
              margin-left: 0.15rem;
            }
          }
        }
      }
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .rotate {
    animation: rotate 30s infinite linear !important;

    &.pause {
      animation-play-state: paused !important;
    }
  }
</style>
