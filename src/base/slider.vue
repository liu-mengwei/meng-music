<!--公共轮播图组件
  实现思路是外面有一个视口容器，
  里面是一个内容容器，这个内容容器的宽高往往要比视口大很多
  然后父组件的内容插入这个子组件的插槽
  组件初始化的过程中要计算内容容器的宽度
  //todo 使用场景是什么 使用场景是可以填入任意的dom结构 有更大的灵活性
-->
<template>
  <div class="slider" ref="slider">
    <!--ref 不能写成驼峰式-->
    <div class="slider-wrapper" ref="sliderWrapper">
      <slot></slot>
    </div>
    <div class="dots-container">
      <!--简洁优雅的写法-->
      <div :class="[{'isActive':currentIndex === index},'dot-item']" v-for="(item,index) in dots"></div>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    data(){
      return {
        dots: [],
        slider: {}, //bscroll封装的对象
        currentIndex: 0,
        timeId: 0
      }
    },

    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },

    //只有在这个钩子里才能取到ref dom节点
    mounted(){
      //可以在回掉中用箭头函数，选择自己的this指向 绑定父级上下文
      setTimeout(() => {
        console.log('slider组件渲染');
        this._initSliderWrapperWidth();
        this._initDots();
        this._initBScroll();

        if (this.autoplay) {
          this._play();
        }
      }, 20);

      window.addEventListener('resize', () => {
        this._initSliderWrapperWidth(true);
        this.slider.refresh();
      });
    },

    methods: {
      //设置容器宽度
      _initSliderWrapperWidth(resize){
        //所用到的都是原生dom方法
        let itemWidth = this.$refs.slider.clientWidth;
        let childern = this.$refs.sliderWrapper.children;
        let sliderWidth = 0;

        for (let child of childern) {

          //这种通用性强不强啊 这还不是默认了父组件会传一个a 里面是一个img
          addClass(child, 'slider-item');
          child.style.width = itemWidth + 'px';
          sliderWidth += itemWidth;
        }

        if (this.loop && !resize) {
          sliderWidth += itemWidth * 2;
        }

        this.$refs.sliderWrapper.style.width = sliderWidth + 'px';
      },

      //初始bsroll
      _initBScroll(){
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        });

        this.slider.on('scrollEnd', this._onScrollEnd);
      },

      //初始dots
      _initDots(){
        this.dots = new Array(this.$refs.sliderWrapper.children.length);
      },

      _onScrollEnd(){
        //获取当前的页码数
        let currentIndex = this.slider.getCurrentPage().pageX;

        //还是不懂为啥要设置这段话
        if (this.loop) {
          currentIndex -= 1;
        }

        this.currentIndex = currentIndex;
        if (this.autoplay) {
          this._play();
        }
      },

      //自动播放 思路就是settimeout 一个时间，不断调用前进的方法
      _play(){
        let nextIndex = this.slider.getCurrentPage().pageX + 1;

        //这一句很关键 如果在定时的过程中 我又滑动了页面的话，就要清除原来的定时滑动动画
        //否则会累计
        clearTimeout(this.timeId);
        this.timeId = setTimeout(() => {
          this.slider.goToPage(nextIndex, 0, 400);
        }, this.interval);
      }

    }
  }
</script>

<style lang="scss" scoped>
  @import "../common/scss/mixin";
  @import "../common/scss/variable";

  .slider {
    width: 100%;
    position: relative;

    .slider-wrapper {
      @include clearfix();

      .slider-item {
        float: left;
        display: block;

        img {
          width: 100%;
        }
      }
    }

    .dots-container {
      position: absolute;
      bottom: 0.15rem;
      margin: 0 auto;
      @include hor-center();

      .dot-item {
        float: left;
        border-radius: 50%;
        background-color: $color-text-ll;
        margin-right: 0.08rem;
        @include square(0.09rem);
        transition: all .1s ease;

        &.isActive {
          width: 0.18rem;
          height: 0.09rem;
          border-radius: 0.05rem;
          background-color: $color-text;
          transition: all .1s ease;
        }
      }

      .dot-item:last-child {
        margin-right: 0;
      }
    }
  }

</style>
