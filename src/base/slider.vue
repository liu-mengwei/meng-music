<!--公共轮播图组件
  实现思路是外面有一个视口容器，
  里面是一个内容容器，这个内容容器的宽高往往要比视口大很多
  然后父组件的内容插入这个子组件的插槽
  组件初始化的过程中要计算内容容器的宽度
  //todo 使用场景是什么
-->
<template>
  <div class="slider" ref="slider">
    <!--ref 不能写成驼峰式-->
    <div class="slider-wrapper" ref="sliderWrapper">
      <slot></slot>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    //只有在这个钩子里才能取到ref dom节点
    mounted(){
      console.log('slider组件渲染');
      this._initSliderWrapperWidth();
      this._initBScroll();
    },

    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoplay: {
        type: Boolean,
        default: true
      }
    },

    methods: {
      //设置容器宽度
      _initSliderWrapperWidth(){
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

        if (this.loop) {
          sliderWidth += itemWidth * 2;
        }

        this.$refs.sliderWrapper.style.width = sliderWidth + 'px';
      },

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
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../common/scss/mixin.scss";

  .slider {
    width: 100%;

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

  }

</style>
