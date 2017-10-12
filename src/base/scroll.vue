<!--todo 干的活就是外层一个父容器 初始化的工作 监听数据变化 并刷新-->
<template>
  <div class="scroll-wrapper" ref="scrollWrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      data: {
        type: Array,
        default: null
      },
      click: {
        type: Boolean,
        default: true
      },
      //监听滚动事件 发送滚动位置
      listenScroll: {
        type: Boolean,
        default: false
      }
    },

    created() {
      console.log('scroll组件创建');
    },

    mounted() {
      console.log('scroll组件渲染');
      setTimeout(() => {
        this._initScroll();
      }, 20);
    },

    updated(){
      console.log('scroll组件更新');
    },

    methods: {
      refresh(){
        this.scroll && this.scroll.refresh();
      },

      scrollToElement(){
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      },

      _initScroll(){
        let options = {probeType: this.probeType, click: this.click};
        this.scroll = new BScroll(this.$refs.scrollWrapper, options);

        if (this.listenScroll) {
          //派发事件
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos.y);
          });
        }
      }
    },

    watch: {
      //监视当数据改变时，自动调用refresh方法
      data(){
        console.log('数据来了');

        //必须等待dom更新 才能刷新scroll
        setTimeout(() => {
          this.refresh();
        }, 20);
      }
    }
  }


</script>

<style scoped lang="scss">
  .scroll-wrapper {
    overflow: hidden;
  }
</style>

