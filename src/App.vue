<template>
  <div id="app">
    <m-header></m-header>
  </div>
</template>

<script type="text/ecmascript-6">
  //todo 注意不要覆盖原生的标签
  import mHeader from 'components/m-header/m-header'

  export default {
    components: {
      mHeader: mHeader
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
