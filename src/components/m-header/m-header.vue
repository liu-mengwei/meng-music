<template>
  <div class="header">
    <div class="header-img"></div>
    <h1 class="header-title">Meng Music</h1>
  </div>
</template>

<style lang="scss" scoped>
  //todo 这里好蠢啊 为什么不导入这两个文件就不能识别 我不是在之前 index 就导入了吗
  @import "../../common/scss/mixin.scss";
  @import "../../common/scss/variable.scss";

  .header {
    height: 0.34rem;
    padding: 0.1rem;
    text-align: center;

    .header-img {
      @include bg-img('logo');
      width: 0.32rem;
      height: 0.34rem;
      background-size: 100%;
      display: inline-block;
      vertical-align: middle;
      margin-right:.1rem;
    }

    .header-title {
      color: $color-theme;
      font-size: $font-size-large;
    }
  }
</style>

<script type="text/ecmascript-6">
  export default {};
</script>
