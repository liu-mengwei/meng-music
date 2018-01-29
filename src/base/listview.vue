<template>
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" @scroll="onScroll"
          :probeType="probeType">
    <ul>
      <li class="list-group" v-for="group in data" ref="listGroup">
        <h1 class="list-group-title">{{group.title}}</h1>
        <ul>
          <li class="group-item" v-for="item in group.items" @click="selectItem(item,$event)">
            <img class="item-avator" v-lazy="item.avatar">
            <span class="item-name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="shortList-container"
         @touchend="onShortListTouchEnd"
         @touchstart="onShortListTouchStart"
         @touchmove.prevent.stop="onShortListTouchMove">
      <ul>
        <li :class="{'active':currentIndex === index}" v-for="(title,index) in shortList" :data-index="index">
          {{title}}
        </li>
      </ul>
    </div>
    <!--固定标题 优化体验-->
    <div class="fixed-title" v-show="fixedTitle" ref="fixedTitle">{{fixedTitle}}</div>
    <div class="title-wrapper" v-show="touchTitleShow && touchTitle">
      <div class="touchTitle">{{touchTitle}}</div>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll'
  import {getData, getPx, touchFeedBack} from 'common/js/dom'

  const ANCHOR_HEIGHT = getPx(0.18);

  export default {
    created(){
      //这里的数据不需要监听
      this.touch = {};
      this.listenScroll = true;
      this.heightList = []; //高度列表
      this.probeType = 3;
    },

    //监听scrollY变化
    data(){
      return {
        scrollY: 0,
        currentIndex: 0,
        touchTitle: '',
        touchTitleShow: false
      }
    },

    props: {
      data: {
        type: Array,
        default: []
      }
    },

    components: {
      Scroll
    },

    methods: {
      //选择歌手 只是把歌手信息派发出去
      selectItem(item, e){
        touchFeedBack(e.currentTarget);
        this.$emit('selectItem', item);
      },

      onShortListTouchStart(e){
        let firstIndex = Number(getData(e.target, 'index'));
        let firstTouch = e.touches[0];

        //记录第一次点击位置
        this.touch.y1 = firstTouch.pageY;
        this.touch.firstIndex = firstIndex;

        //显示大标题
        this.touchTitleShow = true;
        this.touchTitle = this.shortList[firstIndex];

        //this.$refs.listGroup  这里相当于 $(".listGroup") 区别在于这里是原生dom数组
        this._scrollTo(firstIndex);
      },

      onShortListTouchMove(e){
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;

        //偏移量
        let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT);
        let index = this.touch.firstIndex + delta;
        this.touchTitle = this.shortList[index];

        this._scrollTo(index);
      },

      onShortListTouchEnd(e){
        this.touchTitleShow = false;
      },

      //根据newY和heightList算出index
      onScroll(newY){
        this.scrollY = newY;
      },

      refresh(){
        this.$refs.listview.refresh();
      },

      _scrollTo(index){
        this.scrollY = -this.heightList[index];
        //better-scroll已经做好边界情况处理
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index]);
      },

      //计算高度
      _calculateHeight(){
        //第一个高度为0
        let height = 0;
        this.heightList.push(height);

        this.$refs.listGroup.forEach((item) => {
          height += item.clientHeight;
          this.heightList.push(height);
        });
      }
    },

    computed: {
      //右侧首字母列表
      shortList(){
        return this.data.map(function (item) {
          return item.title.substr(0, 1);
        })
      },
      fixedTitle(){
        //'热门'
        if (this.scrollY > 0) {
          return '';
        }

        //有可能是undefined
        if (this.data[this.currentIndex]) {
          return this.data[this.currentIndex].title ? this.data[this.currentIndex].title : '';
        }
      }
    },

    watch: {
      //观察data属性，只有有值了才计算高度
      data(list) {
        if (list.length > 0) {
          setTimeout(() => {
            this._calculateHeight();
          }, 20);
        }
      },

      //判断落在哪个区间
      scrollY(newY){
        //在上方滚动
        if (newY >= 0) {
          this.currentIndex = 0;
        }

        //中间滚动
        for (let i = 0; i < this.heightList.length - 1; i++) {
          let height1 = this.heightList[i];
          let height2 = this.heightList[i + 1];

          let diff = (height2 + newY);
          if (diff >= 0 && diff < getPx(0.32)) {
            //translate3d开启gpu硬件加速
            //-(getPx(0.32)-diff)
            this.$refs.fixedTitle.style.transform = `translate3d(0,${diff - getPx(0.32)}px,0)`;
          } else {
            this.$refs.fixedTitle.style.transform = `translate3d(0,0,0)`;
          }

          if ((-newY >= height1 && -newY < height2)) {
            this.currentIndex = i;
            return;
          }
        }

        //下方滚动
        if (newY > this.heightList[this.heightList - 2]) {
          this.currentIndex = this.heightList - 2;
        }
      }
    }
  }
</script>


<style scoped rel="stylesheet/scss" lang="scss">
  @import "../common/scss/variable";
  @import "../common/scss/mixin";

  .listview {
    color: $color-text-l;
    .list-group {
      .list-group-title {
        @include line-height(0.32rem);
        font-size: $font-size-small;
        background-color: #333;
        padding-left: 0.2rem;
      }
      ul {
        padding: 0.12rem 0;
        .group-item {
          padding: 0.1rem 0.3rem;
          .item-avator {
            @include square(0.5rem);
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 0.15rem;
          }
        }
      }
    }

    .shortList-container {
      padding: 0.2rem 0;
      background-color: $color-background-d;
      font-size: $font-size-small;
      position: fixed;
      right: 0;
      top: 15%;
      border-radius: 10px;
      z-index: 100;

      ul {
        li {
          padding: 0.03rem 0.04rem;
          color: $color-text-l;
          text-align: center;
        }
      }
    }

    .fixed-title {
      @include line-height(0.32rem);
      background-color: #333;
      position: absolute;
      top: -2px;
      font-size: $font-size-small;
      padding-left: 0.2rem;
      width: 100%;
    }

    .title-wrapper {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 50px;
      width: 0.8rem;
      height: 0.8rem;
      text-align: center;
      line-height: 0.8rem;
      background: rgba(100, 100, 100, 0.5);
      border-radius: 10px;
    }
  }

  .active {
    color: $color-theme !important;
  }
</style>
