<template>
  <div class="recommend">
    <!--这里为什么需要一个container 因为我觉得控制padding margin应该交由父组件控制-->
    <div class="slider-container" ref="sliderContainer">
      <slider v-if="this.sliderList.length > 0">
        <a v-for="slider in sliderList" :href="slider.linkUrl">
          <img :src="slider.picUrl">
        </a>
      </slider>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import getRecommend from 'api/recommend'
  import {ERR_OK, SLIDER_RATIO} from 'api/config'
  import Slider from 'base/slider'

  export default {
    data() {
      return {
        //jsonp 获取到的数据
        sliderList: []
      };
    },

    //todo 得去深入看一下组件的生命周期
    created() {
      console.log('recommend组件创建');
      this._getRecommend();
    },

    mounted(){
      this._setSliderContainerWidth();
      window.addEventListener('resize', () => {
        this._setSliderContainerWidth();
      });
    },

    updated(){
      console.log('recommend组件更新')
    },


    methods: {
      //请求接口
      _getRecommend() {
        var self = this;

        //不用promise的话得在这里传入回掉函数
        getRecommend().then(function (res) {
          if (res.code === ERR_OK) {
            //这里有this指向的问题
            self.sliderList = res.data.slider;
          }
        });
      },

      _setSliderContainerWidth(){
        let sliderContainer = this.$refs.sliderContainer;
        sliderContainer.style.height = sliderContainer.clientWidth / SLIDER_RATIO + 'px';
      }
    },

    components: {
      Slider
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .recommend {
    .slider-container {
      overflow: hidden;
    }
  }


</style>
