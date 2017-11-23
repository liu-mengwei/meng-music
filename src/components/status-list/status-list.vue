<template>
  <transition name="mode">
    <div class="status-list-wrapper" v-show="opened">
      <div class="bg-layer" @click="close"></div>
      <div class="status-list">
        <div class="list-item" @click="changeMode(0)">
          <i class="icon icon-sequence"></i> 顺序播放
        </div>
        <div class="list-item" @click="changeMode(1)">
          <i class="icon icon-random"></i> 随机播放
        </div>
        <div class="list-item" @click="changeMode(2)">
          <i class="icon icon-loop"></i> 单曲循环
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import {getData} from 'common/js/dom'
  import $ from 'jquery'

  export default {

    data(){
      return {
        opened: false
      }
    },

    created(){
      console.log('status-list创建');
    },

    mounted(){
      console.log('status-list渲染');
      this.$nextTick(() => {
        //不优雅的解决方式
        this._getModeCls(this.playMode);
      });
    },

    methods: {

      open(){
        this.opened = true;
      },

      close(){
        this.opened = false;
      },

      changeMode(index){
        this.setPlayMode(index);
        this.opened = false;
      },

      _getModeCls(index){
        $('.list-item').removeClass('selected');
        $('.list-item').eq(index).addClass('selected');
      },

      ...mapMutations({
        'setPlayMode': 'SET_PLAY_MODE'
      })

    },

    watch: {
      //这个和实际的顺序就耦合了，还有啥解决办法
      playMode(index){
        this._getModeCls(index);
      }
    },

    computed: {
      ...mapGetters(['playMode'])
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../common/scss/variable";

  .mode-enter, .mode-leave-to {
    opacity: 0;
  }

  .mode-leave, .mode-enter-to {
    opacity: 1;
  }

  .mode-enter-active, .mode-leave-active {
    transition: all 0.3s ease;
  }

  .status-list-wrapper {
    position: relative;
    width: 1.23rem;
    height: 1.36rem;

    .bg-layer {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 100;
    }

    .status-list {
      background: rgba(100, 100, 100, 0.2);
      z-index: 110;
      border-radius: 5px;
      position: absolute;

      .list-item {
        padding: 0.12rem 0.18rem;
        color: rgba(255, 255, 255, 0.6);

        &.selected {
          background: rgba(100, 100, 100, 0.3);
          color: $color-theme;
        }

        .icon {
          vertical-align: middle;
          font-size: 0.22rem;
          color: $color-theme;
          margin-right: 0.05rem;
        }
      }
    }
  }

</style>
