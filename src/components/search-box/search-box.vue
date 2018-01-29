<template>
  <div class="search-box">
    <span class="search-icon fa fa-search"></span>
    <input ref="searchInput" class="search-input" :placeholder="placeHolder" type="text" v-model="query">
    <span class="search-delete icon-dismiss" @click="clearQuery" v-show="query"></span>
  </div>
</template>


<script type="text/ecmascript-6">
  import {debounce} from 'common/js/util'

  export default {
    props: {
      placeHolder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },

    data(){
      return {
        query: ''
      };
    },

    created(){
      this.$watch('query', debounce(() => {
        this.$emit('query', this.query);
      }, 200));
    },

    methods: {
      setQuery(query){
        this.query = query;
      },

      clearQuery(){
        this.query = '';
        this.$emit('clearQuery');
      },

      blur(){
        this.$refs.searchInput.blur();
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "../../common/scss/font-awesome.min.css";
  @import "../../common/scss/icon.css";
  @import "../../common/scss/variable";

  .search-box {
    display: flex;
    align-items: center;
    padding: 0.12rem 0.12rem;
    background: $color-highlight-background;
    border-radius: 0.07rem;

    .search-icon {
      flex: 0 0 auto;
      margin-right: 0.1rem;
      color: $color-background;
      font-size: $font-size-medium-x;
    }

    .search-input {
      flex: 1 1 auto;
      margin-right: 0.1rem;
      outline: none;
      background: none;
      border: none;
      color: #fff;
    }

    .search-delete {
      flex: 0 0 auto;
      color: $color-background;
      font-size: $font-size-medium-x;
    }
  }

</style>
