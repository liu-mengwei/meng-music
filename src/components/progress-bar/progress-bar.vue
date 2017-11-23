<template>
  <div class="progress-bar">
    <span class="current-time" v-show="showTime">{{formatTime}}</span>
    <div class="bar-wrapper"
         @click.stop="onProgressSkip"
         @touchstart.stop="onProgressStart"
         @touchmove.stop="onProgressMove"
         @touchend.stop="onProgressEnd">
      <div class="whole-bar" :class="{'noMargin':!showTime}" ref="wholeBar">
        <div class="finished-bar" ref="finishedBar"></div>
        <div class="circle" ref="circle">
          <transition name="time">
            <div class="time" v-show="timeShow">{{moveTime}}</div>
          </transition>
        </div>
      </div>
    </div>
    <span class="last-time" v-show="showTime">{{formatDuration}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  import {pad, getPx} from 'common/js/dom'
  import {mapGetters} from 'vuex'

  export default {
    data(){
      return {
        timeShow: false,
        moveTime: 0//用手指滑动的时间
      }
    },

    created(){
      //记录刚开始点击的位置
      this.touch = {initial: false};
    },

    props: {
      //经过的时间
      currentTime: {
        type: Number,
        default: 0
      },

      //是否显示时间
      showTime: {
        type: Boolean,
        default: true
      },

      //滚动条高度
      height: {
        type: Number,
        default: 4
      },

      circleWidth: {
        type: Number,
        default: 10
      }
    },

    computed: {
      formatTime(){
        return this._formatTime(this.currentTime);
      },

      formatDuration(){
        return this._formatTime(this.currentSong.duration);
      },

      percent(){
        return this.currentTime / this.currentSong.duration;
      },

      //尽量知道越少的信息越好
      ...mapGetters(['currentSong'])
    },

    methods: {
      _formatTime(time){
        //|0 向下取整 同Math.floor
        let minute = time / 60 | 0;
        let second = pad(time % 60 | 0);
        return minute + ':' + second;
      },

      setOffset(offset){
        this.$refs.finishedBar.style.width = offset + 'px';
        this.$refs.circle.style.left = offset + 'px';
      },

      onProgressStart(e){
        this.touch.initial = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.finishedBarWidth = this.$refs.finishedBar.clientWidth;
        this.touch.percent = 0;

        //为了解决一个原点回退的bug
        this.passMove = false; //是否经过move事件
      },

      onProgressMove(e){
        //可以不触发start而直接触发move事件吗
        if (!this.touch.initial) {
          return;
        }

        //style width获取到的是css的值 clientWidth获取实际宽度
        let wholeBarWidth = this.$refs.wholeBar.clientWidth;

        //往右边移动是正值 设置滚动条的偏移位置
        let offset = e.touches[0].pageX - this.touch.startX;
        let finalWidth = Math.min(wholeBarWidth, Math.max(0, this.touch.finishedBarWidth + offset));
        this.setOffset(finalWidth);
        this.touch.percent = finalWidth / wholeBarWidth;

        this.timeShow = true; //显示上面的时间的
        this.moveTime = this._formatTime(this.currentSong.duration * this.touch.percent);
        this.passMove = true;
      },

      onProgressEnd(){
        //发出一个事件
        if (this.passMove) {
          this.$emit('progressChange', this.touch.percent);
        }

        //重置
        this.timeShow = false;
        this.touch.initial = false;
        this.passMove = false;
      },

      onProgressSkip(e){
        //获得偏移的位置
        let rect = this.$refs.wholeBar.getBoundingClientRect();
        let offset = e.pageX - rect.left;
        let percent = offset / this.$refs.wholeBar.clientWidth;

        this.setOffset(offset);
        setTimeout(() => {
          this.timeShow = true;
          this.moveTime = this._formatTime(this.currentSong.duration * percent);

          setTimeout(() => {
            this.timeShow = false;
          }, 1000);
        }, 200);

        //todo 这里的时间位置要怎么变
        this.$emit('progressChange', percent);
      }
    },

    watch: {
      percent(percent){
        //拖动的优先级高 就不要让它动了
        if (percent >= 0 && !this.touch.initial) {
          let wholeBarWidth = this.$refs.wholeBar.clientWidth;

          let finalWidth = percent * wholeBarWidth;
          this.setOffset(finalWidth);
        }
      }
    },

    updated(){
      //console.log('prgress-bar更新');
    },

    destroyed(){
      console.log('prgress-bar销毁');
    },

    mounted(){
      console.log('progress-bar渲染');
      this.$refs.wholeBar.style.height = this.height + 'px';
      this.$refs.circle.style.height = this.circleWidth + 'px';
      this.$refs.circle.style.width = this.circleWidth + 'px';
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  @import "../../common/scss/variable";

  .progress-bar {
    display: flex;
    justify-content: center;
    align-items: center;

    .current-time, .last-time {
      flex: 0 0 auto;
      font-size: $font-size-small;
    }

    .bar-wrapper {
      flex: 1 1 auto;
      position: relative;
      padding: 0.03rem 0;

      .whole-bar {
        height: 0.04rem;
        background: rgba(255, 255, 255, 0.6);
        margin: 0 0.15rem;
        border-radius: 0.02rem;
        position: relative;

        &.noMargin {
          margin: 0;
        }

        .finished-bar {
          height: 100%;
          width: 0;
          background: $color-theme;
          border-radius: 0.02rem;
        }

        .circle {
          position: absolute;
          width: 0.1rem;
          height: 0.1rem;
          background: #fff;
          border-radius: 50%;
          left: 0;
          top: 50%;
          transform: translate(-50%, -50%);

          .time {
            background: $color-theme;
            position: absolute;
            top: -0.5rem;
            left: -0.2rem;
            padding: 0.07rem 0.15rem;
            border-radius: 0.05rem;
          }
        }
      }
    }
  }

  .time-leave-to {
    opacity: 0;
  }

  .time-leave {
    opacity: 1;
  }

  .time-leave-active, .time-enter-active {
    transition: all 0.2s ease;
  }
</style>
