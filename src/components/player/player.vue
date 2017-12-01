<template>
  <div class="player">
    <!--主界面-->
    <!--貌似必须配合相应的类 否则不能生效-->
    <transition name="main"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="player-main" v-show="playList.length > 0 && fullScreen">
        <div class="bg-image" :style="getBgImage"></div>
        <!--不能写在里头 要不然就给滤掉了-->
        <div class="main-content">
          <div class="main-top">
            <span class="icon-back" @click="back()"></span>
            <h1 class="song-name" v-html="currentSong.name"></h1>
            <div class="singer-wrapper">
              <div class="decorate"></div>
              <span class="song-singer" v-html="currentSong.singer"></span>
              <div class="decorate"></div>
            </div>
          </div>
          <div class="main-middle"
               @click="onLyricToggle"
               @touchend="onLyricSlideEnd"
               @touchmove="onLyricSlideMove"
               @touchstart="onLyricSlideStart">
            <div class="main-middle-l" ref="mainMiddleL">
              <!--必须得包一层吗-->
              <!--距离是需要计算出来的 所以必须用js钩子-->
              <div class="cd-container">
                <div class="cd-wrapper" ref="cdWrapper">
                  <div class="container" :class="cdCls">
                    <img class="cd-instead" src="./cd.png">
                    <img class="cd-image" :src="currentSong.image">
                  </div>
                </div>
              </div>
              <div class="currentLyric-wrapper">
                <p class="first-line" :class="firstLineCls">{{firstLine}}</p>
                <p class="second-line" :class="secondLineCls">{{secondLine}}</p>
              </div>
            </div>
            <!--歌词-->
            <div class="main-middle-r" ref="mainMiddleR">
              <scroll id="lyric-wrapper" class="lyric-wrapper" ref="lyricScroll"
                      :data="currentLyric && currentLyric.lines">
                <div class="lyric">
                  <!--上面的lyric是必须要有的，scroll初始化要用到 但下面的v-for的优先级比v-if更高，所以只能再包一层-->
                  <div v-if="currentLyric">
                    <p class="lyric-line" ref="lyricLines"
                       :class="{'currentLine':index === currentLineNum}"
                       v-for="(line,index) in currentLyric.lines">{{line.txt}}
                    </p>
                  </div>
                </div>
              </scroll>
            </div>
            <div class="dots-container">
              <div class="dot l" :class="{'isActive':showMode === 'cd'}"></div>
              <div class="dot l" :class="{'isActive':showMode === 'lyric'}"></div>
            </div>
          </div>
          <div class="main-bottom">
            <div class="progress-container">
              <progress-bar
                @progressChange="onProgressChange"
                ref="progressBar"
                :currentTime="currentTime"
                :showTime="true"
                :height="3"
                :circleWidth="14">
              </progress-bar>
            </div>
            <div class="operators">
              <div class="status-list-container">
                <status-list ref="statusList"></status-list>
              </div>
              <div class="icon" :class="modeCls" @click="openStatusList"></div>
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
    <div class="player-mini" @click.stop="unfold" v-show="playList.length > 0">
      <div class="mini-cd" ref="miniCd" :class="cdCls">
        <img class="cd-instead" src="./cd.png">
        <img class="cd-image" :src="currentSong.image">
      </div>
      <div class="mini-content">
        <div class="progress-container">
          <progress-bar
            @progressChange="onProgressChange"
            :currentTime="currentTime"
            :showTime="false"
            :height="2"
            :circleWidth="10">
          </progress-bar>
        </div>
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
    <audio ref="audio" :src="currentSong.url"
           @ended="next"
           @timeupdate="timeupdate"
           @canplay="canplay"
           @error="error"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import StatusList from 'components/status-list/status-list'
  import ProgressBar from 'components/progress-bar/progress-bar'
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {getPx, getStyle} from '../../common/js/dom'
  import $ from 'jquery';
  import {modeType} from '../../store/config'
  import Lyric from 'lyric-parser'
  import Scroll from '../../base/scroll.vue'
  import {showMoreMixin} from '../../common/js/mixin'

  const transform = getStyle('transform');
  const transition = getStyle('transition');
  const animation = getStyle('animation');
  const opacity = getStyle('opacity');

  export default {
    mixins: [showMoreMixin],
    data(){
      return {
        musicReady: false,
        backStatus: false,
        currentTime: 0,
        beforeIndexArr: [],
        currentLyric: null, //当前歌词列表,
        currentLineNum: -1,
        showMode: 'cd', //当前是cd 还是歌词
        canAutoScroll: true
      }
    },

    created(){
      this.touch = {initial: false};
      console.log('player组件创建');
    },

    mounted(){
      console.log('player组件渲染');
    },

    computed: {
      getBgImage(){
        return `background-image:url(${this.currentSong.image})`
      },

      //cd 下面的歌词
      firstLine(){
        if (!this.currentLyric || this.currentLyric.lines.length === 0 || this.currentLineNum === -1) {
          return '';
        }

        //如果是偶数
        if (this.currentLineNum % 2 === 0) {
          return this.currentLyric.lines[this.currentLineNum].txt;
        } else {
          return this.currentLineNum + 1 >= this.currentLyric.lines.length
            ? '' : this.currentLyric.lines[this.currentLineNum + 1].txt;
        }
      },

      secondLine(){
        if (!this.currentLyric || this.currentLyric.lines.length === 0 || this.currentLineNum === -1) {
          return '';
        }

        //如果是奇数
        if (this.currentLineNum % 2 === 1) {
          return this.currentLyric.lines[this.currentLineNum].txt;
        } else {
          return this.currentLineNum + 1 >= this.currentLyric.lines.length
            ? '' : this.currentLyric.lines[this.currentLineNum + 1].txt;
        }
      },

      firstLineCls(){
        if (this.currentLineNum === -1) {
          return '';
        }
        return this.currentLineNum % 2 === 0 ? 'isActive' : '';
      },

      secondLineCls(){
        if (this.currentLineNum === -1) {
          return '';
        }
        return this.currentLineNum % 2 === 1 ? 'isActive' : '';
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

      //播放图标样式
      modeCls(){
        let mode = 'icon-';
        switch (this.playMode) {
          case modeType.sequence:
            mode += 'sequence';
            break;
          case modeType.random:
            mode += 'random';
            break;
          case modeType.loop:
            mode += 'loop';
            break;
        }
        return mode;
      },

      percent(){
        return this.currentTime / this.currentSong.duration;
      },

      ...mapGetters(['fullScreen', 'playList', 'currentSong', 'playing', 'playMode', 'currentIndex'])
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

        animations.runAnimation($('.cd-wrapper')[0], 'move', done);
      },

      afterEnter(){
        animations.unregisterAnimation('move');
      },

      leave(el, done){
        const {x, y, scale} = this._getPos();
        let cdWrapperEl = $('.cd-wrapper')[0];

        //兼容性处理
        cdWrapperEl.style[transform] = `translate3d(${-x}px,${y}px,0) scale(${scale})`;
        cdWrapperEl.style[transition] = 'all 0.4s'

        cdWrapperEl.addEventListener('transitionend', done);
      },

      afterLeave(){
        let cdWrapperEl = $('.cd-wrapper')[0];
        cdWrapperEl.style[transform] = '';
        cdWrapperEl.style[transition] = '';
      },

      //切换播放
      togglePlay(){
        if (!this.musicReady) {
          return;
        }

        if (this.currentLyric) {
          this.currentLyric.togglePlay();
        }

        this.setPlaying(!this.playing);
      },

      //获取歌词
      getLyric(){
        //先清理之前歌词的定时器
        if (this.currentLyric) {
          this.currentLyric.stop();
        }

        this.currentSong.getLyric().then((res) => {
          this.currentLyric = new Lyric(res, this.lyricHandle);
          if (this.musicReady && this.playing) {
            this.currentLyric.play();
          }
          //优化操作 歌词要重置
        }).catch(() => {
          console.log('出错');
          this.currentLyric = null;
          this.currentLineNum = -1;
        });
      },

      lyricHandle({lineNum, txt}){
        this.currentLineNum = lineNum;

        //优化 手指让它滚动时，不要让它再自动滚
        if (this.canAutoScroll) {
          this.scrollToEle(lineNum, 1000);
        }
      },

      //歌词滚动
      scrollToEle(lineNum, time){
        if (lineNum < 0 || !this.$refs.lyricScroll) {
          return;
        }

        if (lineNum > 6) {
          this.$refs.lyricScroll.scrollToElement(this.$refs.lyricLines[lineNum - 6], time);
        } else {
          this.$refs.lyricScroll.scrollToElement(this.$refs.lyricLines[0], time);
        }
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

        //单曲循环的优先级更高
        if (this.playMode === modeType.loop) {
          this.$refs.audio.load();
          this.$refs.audio.play();
          this.musicReady = false;
          return;
        }

        //如果不存在的话 按照模式播放
        if (this.beforeIndexArr.length <= 0) {
          switch (this.playMode) {
            case modeType.sequence:
              //退回最后一首
              //这里不能用--,不然的话就直接赋值了
              index = (this.currentIndex - 1) < 0 ? this.playList.length - 1 : (this.currentIndex - 1);
              break;
            case modeType.random:
              index = Math.floor(Math.random() * this.playList.length);
              break;
          }

        } else { //上一首始终是上一次播放过的歌曲 得维护一个播放过歌曲的列表
          index = this.beforeIndexArr.pop();
        }

        this.setCurrentIndex(index);
        this.setPlaying(true);
        this.musicReady = false;
        this.lyricReset();
      },

      next(){
        if (!this.musicReady) {
          return;
        }

        this.backStatus = false;

        let index = -1;
        switch (this.playMode) {
          case modeType.sequence:
            index = (this.currentIndex + 1) === this.playList.length ? 0 : (this.currentIndex + 1);
            break;
          case modeType.random:
            index = Math.floor(Math.random() * this.playList.length);
            break;
          case modeType.loop:
            index = this.currentIndex;
            this.$refs.audio.load();
            this.$refs.audio.play();
            if (this.currentLyric) {
              this.currentLyric.seek(0);
            }
            return;
        }

        this.setCurrentIndex(index);
        this.setPlaying(true);
        this.musicReady = false;
        this.lyricReset();
      },

      lyricReset(){
        if (this.currentLyric) {
          this.currentLyric.stop();
        }
        this.currentLyric = null;
      },

      //打开播放模式列表
      openStatusList(){
        this.$refs.statusList.open();
      },

      //可以播放
      canplay(){
        this.musicReady = true;
      },

      //音乐获取失败
      error(){
        this.musicReady = true;
      },

      //获取时间进度
      timeupdate(){
        this.currentTime = this.$refs.audio.currentTime;
      },

      onProgressChange(percent){
        let time = percent * this.currentSong.duration
        this.$refs.audio.currentTime = time;

        if (this.currentLyric) {
          this.currentLyric.seek(time * 1000);

          //修复暂停又开始播放的bug
          if (!this.playing) {
            //hack 这里手动写一个歌词pause方法
            this.currentLyric.state = 1;
            this.currentLyric.togglePlay();
          }
        }
      },

      //左右滑动歌词实现
      onLyricSlideStart(e){
        this.touch.initial = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.startY = e.touches[0].pageY;
        this.touch.offsetX = 0;
        this.touch.moveArr = []; //优化用的

        //记录第一次滑动的y值
        //this.touch.startTranslateY = this.getTranslateY($('#lyric-wrapper').css('transform'));
      },

      onLyricSlideMove(e){
        if (!this.touch.initial) {
          return;
        }

        this.canAutoScroll = false; //优化 手指让它滚动时，不要让它再自动滚
        let offsetX = e.touches[0].pageX - this.touch.startX;
        let offsetY = e.touches[0].pageY - this.touch.startY;

        if (Math.abs(offsetX) <= Math.abs(offsetY)) {
          //this._translateY(offsetY);
          return;
        }

        //优化措施 在cd的时候往右边滑
        if (offsetX > 0 && this.showMode === 'cd') {
          return;
        }

        //可能是从左往右滑
        let width = this.showMode === 'cd' ? 0 : -window.innerWidth;
        let finalWidth = width + offsetX;

        this.$refs.mainMiddleR.style[transition] = '';
        this.$refs.mainMiddleR.style[transform] = `translate3d(${finalWidth}px,0,0)`;
        this.$refs.mainMiddleL.style[opacity] = 1 - Math.abs(finalWidth / window.innerWidth);
        this.touch.offsetX = finalWidth;

        // 优化措施 例如用户先往左滑 再往右滑 存下上次滑动的值
        if (this.touch.moveArr.length === 2) {
          this.touch.moveArr.splice(0, 1, this.touch.moveArr[1]);
          this.touch.moveArr.splice(1, 1, e.touches[0].pageX);
        } else {
          this.touch.moveArr.push(e.touches[0].pageX);
        }
      },

      onLyricSlideEnd(e){
        this.canAutoScroll = true; //优化 手指让它滚动时，不要让它再自动滚

        //竖着滑
        if (this.touch.offsetX === 0) {
          return;
        }

        let windowWidth = window.innerWidth;
        let mainMiddleR = this.$refs.mainMiddleR;
        let mainMiddleL = this.$refs.mainMiddleL;
        let ratio = Math.abs(this.touch.offsetX) / windowWidth;

        mainMiddleR.style[transition] = 'all 0.3s ease';

        if (this.showMode === 'cd') {
          if (ratio > 0.1 && this.touch.offsetX < 0 && this.touch.moveArr[1] < this.touch.moveArr[0]) {
            mainMiddleR.style[transform] = `translate3d(${-windowWidth}px,0,0)`;
            mainMiddleL.style[opacity] = 0;
            this.showMode = 'lyric';
          } else {
            mainMiddleR.style[transform] = `translate3d(0,0,0)`;
            mainMiddleL.style[opacity] = 1;
          }
        }

        else if (this.showMode === 'lyric') {
          if (ratio < 0.9 && this.touch.moveArr[1] > this.touch.moveArr[0]) {
            mainMiddleR.style[transform] = `translate3d(0,0,0)`;
            mainMiddleL.style[opacity] = 1;
            this.showMode = 'cd';
          } else {
            mainMiddleR.style[transform] = `translate3d(${-windowWidth}px,0,0)`;
            mainMiddleL.style[opacity] = 0;
          }
        }

        this.slideReset();
      },

      onLyricToggle(){
        let mainMiddleL = this.$refs.mainMiddleL;
        let mainMiddleR = this.$refs.mainMiddleR;
        let windowWidth = window.innerWidth;

        mainMiddleR.style[transition] = '';
        if (this.showMode === 'cd') {
          mainMiddleL.style[opacity] = 0;
          mainMiddleR.style[transform] = `translate3d(${-windowWidth}px,0,0)`;
          this.showMode = 'lyric';
        } else {
          this.restartRotate();
          mainMiddleL.style[opacity] = 1;
          mainMiddleR.style[transform] = `translate3d(0,0,0)`;
          this.showMode = 'cd';
        }
      },

      slideReset(){
        this.touch.initial = false;
        this.touch.offsetX = 0;
        this.touch.moveArr = [];
      },

      //重启rotate动画 方法是把元素删除再加入
      restartRotate(){
        let el = $('.cd-wrapper');
        let newone = el.clone(true);
        el.before(newone);
        $('.cd-container .cd-wrapper:last-child').remove();
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

      //歌曲名是否超过长度 true为超过了长度
      getWrapperAndContent(){
        let contentEl = $('.mini-songName');
        let wrapperEl = $('.songName-wrapper');
        return {contentEl, wrapperEl};
      },

      //向上滑动，先不调用scroll滑动方法
      //_translateY(offsetY){
      //  let lyricScroll = this.$refs.lyricScroll;
      //  let translateY = this.getTranslateY($('#lyric-wrapper').css('transform'));
      //
      //  let finalOffset = this.touch.startTranslateY + offsetY;
      //  if (translateY > 0) {
      //    lyricScroll.disable();
      //    lyricScroll.$el.style[transform] = `translate3d(0,${Math.max(0, finalOffset)}px,0)`;
      //  } else {
      //    lyricScroll.enable();
      //    //移动完剩余的距离
      //    lyricScroll.scrollTo(0, this.touch.startTranslateY + offsetY, 0);
      //  }
      //},

      //由matrix 提取出translateY值
      //getTranslateY(translateYStr){
      //  let regexp = /matrix\((.+)\)/;
      //  return +regexp.exec(translateYStr)[1].split(',')[5].trim();
      //},

      ...mapMutations({
        'setFullScreen': 'SET_FULLSCREEN',
        'setPlaying': 'SET_PLAYING',
        'setCurrentIndex': 'SET_CURRENT_INDEX'
      })
    },

    watch: {
      currentSong(newVal, oldVal){
        this.$nextTick(() => {
          //记录这次播放的歌曲
          this.beforeSong = this.oldVal;
          this.$refs.audio.play();
          this.getLyric();

          //切歌后先终止之前的动画
          let el = this.getWrapperAndContent();
          this.endShowMoreAnimation(el);
          this.startShowMoreAnimation(el);
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
          this.$refs.lyricScroll.refresh();

          //优化切换时歌词显示
          this.scrollToEle(this.currentLineNum, 0);

          //这句是必加的 原点优化
          let wholeBarWidth = this.$refs.progressBar.$refs.wholeBar.clientWidth;
          this.$refs.progressBar.setOffset(this.percent * wholeBarWidth);

          //判断歌名是否超过了长度
          let el = this.getWrapperAndContent();
          this.endShowMoreAnimation(el);

          //不是全屏的情况下
          if (!fullScreen) {
            this.startShowMoreAnimation(el);
          }
        })
      },

      //播放歌词逻辑
      musicReady(newVal){
        if (newVal && this.playing && this.currentLyric) {
          this.currentLyric.play();
        }
      }
    },

    components: {
      StatusList,
      ProgressBar,
      Scroll
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
      z-index: 200;

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

          .singer-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            max-width: 75%;
            margin: 0 auto;

            .decorate {
              width: 0.2rem;
              display: inline-block;
              border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            }

            .song-singer {
              margin: 0 0.05rem;
              @include nowrap();
            }
          }

        }

        .main-middle {
          white-space: nowrap;
          position: fixed;
          left: 0;
          right: 0;
          bottom: 1.5rem;
          top: 0.95rem;
          font-size: 0;

          .main-middle-l {
            /*等比例*/
            width: 100%;
            height: 100%;
            position: relative;
            display: inline-block;
            vertical-align: top;

            .cd-container {
              width: 100%;
              padding-top: 80%;
              position: relative;

              .cd-wrapper {
                position: absolute;
                width: 80%;
                margin: 0 auto;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                transition: all 0.3s ease;

                .container {
                  width: 100%;
                  height: 100%;
                  box-sizing: border-box;
                  border-radius: 50%;
                  overflow: hidden;
                  border: 10px solid hsla(0, 0%, 100%, .1);
                  position: relative;

                  .cd-instead {
                    width: 100%;
                    height: 100%;
                    transform: scale(1.4) translate(0.03rem, 0.05rem);
                    position: absolute;
                    left: 0;
                  }

                  .cd-image {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    z-index: 10;
                  }
                }
              }
            }
          }

          .currentLyric-wrapper {
            position: absolute;
            bottom: 0.4rem;
            font-size: $font-size-medium-x;
            color: $color-text-ll;
            width: 80%;
            margin: 0 auto;
            left: 0;
            right: 0;
            text-align: center;
            line-height: 0.2rem;

            .first-line {
              @include nowrap();
              &.isActive {
                color: $color-theme;
              }
            }

            .second-line {
              @include nowrap();
              margin-top: 0.08rem;
              &.isActive {
                color: $color-theme;
              }
            }
          }

          .main-middle-r {
            overflow: hidden;
            width: 100%;
            height: 90%;
            text-align: center;
            display: inline-block;
            vertical-align: top;

            .lyric-wrapper {
              color: $color-text-ll;
              font-size: $font-size-medium-x;
              width: 80%;
              height: 100%;
              letter-spacing: 0.01rem;
              margin: 0 auto;
              /*transform: translateY(190px);*/

              .lyric {
                white-space: normal;
                .lyric-line {
                  margin: 0.15rem 0;

                  &.currentLine {
                    color: $color-theme;
                  }
                }
              }
            }
          }

          .dots-container {
            position: absolute;
            bottom: 0;
            @include hor-center();

            .dot {
              @include square(0.09rem);
              border-radius: 50%;
              background: #fff;
              opacity: 0.4;

              &:last-child {
                margin-left: 0.1rem;
              }

              &.isActive {
                opacity: 1;
              }
            }
          }
        }

        .main-bottom {
          position: absolute;
          bottom: 0.3rem;
          width: 100%;

          .progress-container {
            padding: 0 0.2rem;
          }

          .operators {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 0 0.15rem;
            margin-top: 0.15rem;

            .icon {
              font-size: 0.32rem;
              color: $color-theme;
            }

            .status-list-container {
              position: absolute;
              bottom: 0.65rem;
              left: 0.33rem;
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
      height: 0.65rem;
      z-index: 100;
      display: flex;
      box-shadow: 0 -2px 2px 3px rgba(17, 21, 25, 0.4);

      .mini-cd {
        width: 0.65rem;
        height: 0.65rem;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid rgb(31, 27, 27);
        position: relative;
        bottom: 0.13rem;
        left: 0.1rem;
        flex: 0 0 auto;

        .cd-instead {
          width: 100%;
          height: 100%;
          transform: scale(1.4);
          position: absolute;
          left: 0;
        }

        .cd-image {
          width: 100%;
          border-radius: 50%;
          overflow: hidden;
          position: absolute;
          left: 0;
        }
      }

      .mini-content {
        margin-left: 0.2rem;
        flex: 1 1 auto;

        .progress-container {
          margin: 0.06rem 0 0.1rem;
          padding-right: 0.15rem;
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
