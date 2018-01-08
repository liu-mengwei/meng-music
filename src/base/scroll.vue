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
      },
      //监听上拉刷新
      listenPullUp: {
        type: Boolean,
        default: false
      },
      //针对移动端的优化
      listenBeforeScroll: {
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

    methods: {
      refresh(){
        this.scroll && this.scroll.refresh();
      },

      disable(){
        this.scroll && this.scroll.disable();
      },

      enable(){
        this.scroll && this.scroll.enable();
      },

      scrollToElement(){
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      },

      scrollTo(){
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },

      scrollBy(){
        this.scroll && this.scroll.scrollBy.apply(this.scroll, arguments);
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

        if (this.listenPullUp) {
          this.scroll.on('scrollEnd', () => {
            console.log(this.scroll.y);
            console.log(this.scroll.maxScrollY);

            if (this.scroll.y <= this.scroll.maxScrollY + 10) {
              //判断是否划到底
              this.$emit('scrollToEnd');
            }
          })
        }

        if (this.listenBeforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScrollStart');
          });
        }
      }
    },

    watch: {
      //监视当数据改变时，自动调用refresh方法
      data(){
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

