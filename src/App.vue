<template>
  <div id="app">
    <m-header class="header"></m-header>
    <tab class="tab"></tab>
    <transition name="toggle">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  //todo 注意不要覆盖原生的标签
  //一般通常来讲 Mheader 要大写 因为这通常代表是一个类
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'

  export default {
    components: {
      MHeader,
      Tab,
      Player
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "common/scss/variable";

  #app {
    color: $color-text-ll;

    .tab {
      margin-top: 0.05rem;
      margin-bottom: 0.07rem;
    }

    .toggle-enter {
      transform: translateX(100%);
    }

    .toggle-enter-to {
      transform: translateX(0);
    }

    .toggle-enter-active {
      transition: all 0.3s ease;
    }
  }
</style>
