<template>
  <div id="app">
    <m-header class="header"></m-header>
    <tab class="tab"></tab>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  //todo 注意不要覆盖原生的标签
  //一般通常来讲 Mheader 要大写 因为这通常代表是一个类
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'

  export default {
    components: {
      MHeader,
      Tab
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  #app {
    .tab {
      margin-top: 0.05rem;
      margin-bottom: 0.07rem;
    }
  }
</style>
