<template>
  <transition name="mode">
    <div class="status-list-wrapper" v-show="opened">
      <div class="bg-layer" @click.stop="close"></div>
      <div class="status-list" :class="{'bgBlack':bgBlack}">
        <div class="list-item" :class="{'selected':playMode === index-1}" v-for="index in 3"
             @click.stop="changeMode(index-1)">
          <i class="icon" :class="modeCls(index-1)"></i><span v-text="modeText(index-1)"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import {getData} from 'common/js/dom'
  import $ from 'jquery'
  import {getModeCls, getModelText} from '../../common/js/playMode'

  export default {
    props: {
      //背景是否透明
      bgBlack: {
        type: Boolean,
        default: false
      }
    },

    data(){
      return {
        opened: false
      }
    },

    created(){
      console.log('status-list创建');
    },

    methods: {
      open(){
        this.opened = true;
      },

      close(){
        this.opened = false;
        this.$emit('close');
      },

      changeMode(index){
        this.setPlayMode(index);
        this.opened = false;
        this.$emit('close');
      },

      modeCls(index){
        return getModeCls(index);
      },

      modeText(index){
        return getModelText(index);
      },

      ...mapMutations({
        'setPlayMode': 'SET_PLAY_MODE'
      })

    },

    computed: {
      ...mapGetters(['playMode'])
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../common/scss/variable";

  /*.mode-enter, .mode-leave-to {*/
  /*opacity: 0;*/
  /*}*/

  /*.mode-leave, .mode-enter-to {*/
  /*opacity: 1;*/
  /*}*/

  /*.mode-enter-active, .mode-leave-active {*/
  /*transition: all 0.3s ease;*/
  /*}*/

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

      &.bgBlack {
        background: #000;
      }

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
