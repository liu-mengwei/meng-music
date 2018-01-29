<template>
  <div class="header">
    <div class="header-img"></div>
    <h1 class="header-title">Meng Music</h1>
    <div class="user-wrapper" @click.stop="openUser">
      <i class="icon-mine"></i>
    </div>
    <user ref="user"></user>
  </div>
</template>

<script type="text/ecmascript-6">
  import User from 'components/user/user'

  export default {
    methods: {
      openUser(){
        this.$refs.user.toggle();
      }
    },

    components: {
      User
    }
  };
</script>


<style lang="scss" scoped>
  //todo 为什么不导入这两个文件就不能识别 我不是在之前 index 就导入了吗
  @import "../../common/scss/mixin.scss";
  @import "../../common/scss/variable.scss";

  .header {
    padding: 0.07rem;
    text-align: center;
    position: relative;

    .header-img {
      @include bg-img('logo');
      width: 0.33rem;
      height: 0.35rem;
      background-size: 100%;
      display: inline-block;
      vertical-align: middle;
      margin-right: .1rem;
    }

    .header-title {
      display: inline-block;
      vertical-align: top;
      color: $color-theme;
      font-size: $font-size-large;
      @include line-height(0.35rem)
    }

    .user-wrapper {
      position: absolute;
      right: 0.06rem;
      top: 0.05rem;
      padding: 0.1rem;

      .icon-mine {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
  }
</style>


