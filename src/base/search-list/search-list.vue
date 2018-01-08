<template>
  <ul class="search-list">
    <li class="search-item" v-for="search in searchList" @click.stop="selectHistory(search)">
      <span class="search-clock fa fa-clock-o"></span>
      <div class="search-text">{{search}}</div>
      <span class="search-close icon-delete" @click.stop="removeSearch(search)"></span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searchList: {
        type: Array,
        default: []
      }
    },

    methods: {
      removeSearch(search){
        this.$emit('removeSearch', search);
      },

      selectHistory(search){
        this.$emit('selectHistory', search);
      }
    }
  }


</script>

<style rel="stylesheet/scss" lang="scss">
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";
  @import "../../common/scss/icon.css";
  @import "../../common/scss/font-awesome.min.css";

  .search-list {
    .search-item {
      display: flex;
      padding: 0.15rem 0.2rem;
      border-top: 1px solid rgba(120, 120, 120, 0.2);
      align-items: center;

      .search-clock {
        flex: 0 0 auto;
        font-size: $font-size-medium-x;
        margin-right: 0.1rem;
      }

      .search-text {
        flex: 1 1 auto;
        @include nowrap();
      }

      .search-close {
        flex: 0 0 auto;
        font-size: $font-size-small;
        opacity: 0.3;
      }

      &:last-child {
        border-bottom: 1px solid rgba(120, 120, 120, 0.2);
      }
    }
  }
</style>
