<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="discList" ref="recommendContent">
      <!--必须要有这个内部容器-->
      <div>
        <!--这里为什么需要一个container 因为我觉得控制padding margin应该交由父组件控制-->
        <div class="slider-container" ref="sliderContainer">
          <slider v-if="this.sliderList.length > 0">
            <a v-for="slider in sliderList" :href="slider.linkUrl">
              <img :src="slider.picUrl">
            </a>
          </slider>
        </div>
        <div class="recommend-title">热门歌单推荐</div>
        <div class="list-container">
          <ul>
            <li class="disc-item" v-for="item in discList" @click="selectDisc(item,$event)">
              <img v-lazy="item.imgurl" class="disc-img">
              <div class="disc-wrapper">
                <h1 class="disc-title">{{item.dissname}}</h1>
                <div class="disc-desc">{{item.creator.name}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container">
        <loading v-show="discList.length == 0"></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK, SLIDER_RATIO} from 'api/config'
  import Slider from 'base/slider'
  import Scroll from 'base/scroll'
  import Loading from 'base/loading/loading'
  import {miniPlayMixin} from '../../common/js/mixin'
  import {mapMutations} from 'vuex'
  import {touchFeedBack} from 'common/js/dom'

  export default {
    mixins: [miniPlayMixin],
    data() {
      return {
        //jsonp 获取到的数据
        sliderList: [],
        discList: []
      };
    },

    //todo 得去深入看一下组件的生命周期
    created() {
      console.log('recommend组件创建');
      this._getRecommend();
      this._getDiscList();
    },

    mounted() {
      this._setSliderContainerWidth();
      window.addEventListener('resize', () => {
        this._setSliderContainerWidth();
      });
    },

    updated() {
      console.log('recommend组件更新')
    },

    methods: {
      handleMiniPlay(){
        let bottom = 0;
        if (this.playList.length > 0) {
          bottom = '0.7rem';
        }
        this.$refs.recommend.style['bottom'] = bottom;
        this.$refs.recommendContent.refresh();

      },

      selectDisc(item, e){
        touchFeedBack(e.currentTarget);
        this.setDisc(item);
        this.$router.push(`recommend/${item.dissid}`);
      },

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

      _getDiscList() {
        getDiscList().then((res) => {
          console.log(res.data);
          this.discList = res.data.list;
        })
      },

      _setSliderContainerWidth(){
        let sliderContainer = this.$refs.sliderContainer;
        sliderContainer.style.height = sliderContainer.clientWidth / SLIDER_RATIO + 'px';
      },

      ...mapMutations({'setDisc': 'SET_DISC'})
    },

    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  @import "../../common/scss/variable";

  .recommend {
    position: fixed;
    top: 0.9rem;
    bottom: 0;
    width: 100%;

    .recommend-content {
      height: 100%;
      overflow: hidden;

      .slider-container {
        overflow: hidden;
      }

      .recommend-title {
        text-align: center;
        padding: 0.25rem 0 0.08rem 0;
        color: $color-theme;
      }

      .list-container {
        margin-top: 0.1rem;
        position: relative;

        ul {
          .disc-item {
            padding: 0.12rem 0.2rem;
            display: flex;
            align-content: center;

            .disc-img {
              width: 0.6rem;
              height: 0.6rem;
              flex: 0 0 auto;
            }

            .disc-wrapper {
              margin-left: 0.2rem;
              flex: 1 1 auto;
              display: flex;
              flex-direction: column;
              justify-content: center;

              .disc-title {
                margin-bottom: 0.15rem;
                color: $color-text;
              }

              .disc-desc {
                color: $color-text-d;
              }
            }
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%);
    }
  }


</style>
