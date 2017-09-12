<template>
  <nav class="tab">
    <ul class="tab-list">
      <li class="tab-item l">
        <router-link class="tab-title" to="/recommend">推荐</router-link>
      </li>
      <li class="tab-item l">
        <router-link class="tab-title" to="/singer">歌手</router-link>
      </li>
      <li class="tab-item l">
        <router-link class="tab-title" to="/rank">排行</router-link>
      </li>
      <li class="tab-item l">
        <router-link class="tab-title" to="/search">搜索</router-link>
      </li>
    </ul>
  </nav>
</template>

<script type="text/ecmascript-6">
  export default {};
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .tab {

    .tab-list {
      display: flex;

      .tab-item {
        flex: 1 1 auto;
        text-align: center;

        .tab-title {
          display: inline-block;
          color: $color-text;
          @include line-height(0.26rem);

          &.router-link-active {
            border-bottom: 2px solid $color-theme;
            color: $color-theme;
          }
        }
      }
    }
  }

</style>
