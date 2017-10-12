<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>


<style rel="stylesheet/scss" lang="scss">
  @import "../../common/scss/variable";

  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s ease;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .slide-enter-to, .slider-leave {
    transform: translate3d(0, 0, 0);
  }

  .singer-detail {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: $color-background;
  }
</style>
