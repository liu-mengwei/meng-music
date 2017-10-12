<template>
  <div class="loading">
    <img class="loading-img" src="./loading.gif">
    <span class="loading-title">{{title}}</span>
  </div>
</template>


<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在加载中...'
      }
    }
  }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../common/scss/variable";

  .loading {
    font-size: $font-size-small;
    .loading-img {
      width: 0.22rem;
      height: 0.22rem;
      vertical-align: middle;
      margin-right: 0.02rem;
    }
  }
</style>
