<template>
  <div class="no-result">
    <div class="noResult-img"></div>
    <p class="noResult-title">{{title}}</p>
  </div>
</template>


<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '抱歉，暂无搜索结果...'
      }
    }
  }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .no-result {
    //position: relative;
    //top: 40%;
    //transform: translateY(-50%);

    .noResult-img {
      margin: 0 auto;
      @include square(1rem);
      @include bg-img('./no-result');
      background-size: contain;
    }

    .noResult-title {
      margin-top: 0.2rem;
      text-align: center;
    }
  }

</style>
