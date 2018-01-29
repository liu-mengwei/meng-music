<template>
  <div class="search">
    <div class="searchBox-wrapper">
      <search-box ref="searchBox" @query="onQuery"></search-box>
    </div>
    <scroll class="scrollContent-wrapper" ref="scrollWrapper" :data="mixinArray" :refreshDelay="200">
      <div class="scroll-content">
        <div class="search-recommend" v-show="!query">
          <p class="hot-title">热门搜索</p>
          <div class="shortCut-container">
            <div class="hotKey l" @click="selectHotKey(hotkey.k)" v-for="hotkey in hotKeys">{{hotkey.k}}</div>
          </div>
        </div>
        <div class="searchList-wrapper" v-show="!query && searchHistoryList.length>0">
          <div class="search-content">
            <search-list :searchList="searchHistoryList" @removeSearch="remove"
                         @selectHistory="selectHotKey">
            </search-list>
          </div>
          <div class="search-clear">
            <span class="clear-text" @click="removeAll">清空搜索历史</span>
          </div>
        </div>
      </div>
    </scroll>
    <div class="suggest-wrapper" ref="suggestWrapper" v-show="query">
      <suggest
        :query="query"
        :showSinger="showSinger"
        ref="suggest"
        @select="insertSearchHistory"
        @beforeScrollStart="inputBlur">
      </suggest>
    </div>
    <confirm @confirm="removeAllSearch" ref="confirm" confirmText="确定清空搜索历史？"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from '../search-box/search-box'
  import Suggest from '../suggest/suggest'
  import {getHotKey} from 'api/search'
  import {mapActions, mapGetters} from 'vuex'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll'
  import {miniPlayMixin, searchMixin} from 'common/js/mixin'

  export default {
    mixins: [miniPlayMixin, searchMixin],
    data(){
      return {
        hotKeys: [],
        showSinger: true
      }
    },

    created(){
      this._getHotKey();
    },

    methods: {
      removeAll(){
        this.$refs.confirm.toggle();
      },

      handleMiniPlay(){
        let bottom = 0;
        if (this.playList.length > 0) {
          bottom = '0.7rem';
        }
        this.$refs.suggestWrapper.style['bottom'] = bottom;
        this.$refs.scrollWrapper.$el.style['bottom'] = bottom;
        this.$refs.suggest.refresh();
        this.$refs.scrollWrapper.refresh();
      },

      _getHotKey(){
        getHotKey().then((res) => {
          if (res.code === 0) {
            this.hotKeys = res.data.hotkey.slice(0, 10);
          }
        })
      },

      ...mapActions(['removeAllSearch'])
    },

    computed: {
      mixinArray(){
        return this.hotKeys.concat(this.searchHistoryList);
      },

      ...mapGetters(['searchHistoryList'])
    },

    watch: {
      query(){
        setTimeout(() => {
          this.$refs.scrollWrapper.refresh();
        }, 20);
      }
    },

    components: {
      SearchBox,
      Suggest,
      Confirm,
      SearchList,
      Scroll
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .search {

    .searchBox-wrapper {
      width: 100%;
      margin: 0.25rem 0;
      padding: 0 0.2rem;
      box-sizing: border-box;
    }

    .scrollContent-wrapper {
      position: fixed;
      top: 1.7rem;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;

      .scroll-content {
        .search-recommend {
          padding: 0 0.2rem;

          .hot-title {
            margin: 0.1rem 0 0.2rem;
          }

          .shortCut-container {
            .hotKey {
              display: inline-block;
              padding: 0.08rem 0.12rem;
              background: $color-highlight-background;
              border-radius: 0.1rem;
              margin: 0 0.15rem 0.12rem 0;
              font-size: $font-size-small;
            }

            @include clearfix();
          }
        }

        .searchList-wrapper {
          margin-top: 0.2rem;

          .search-clear {
            padding: 0.2rem 0;
            color: $color-theme;
            text-align: center;

            .clear-text {
              padding: 0.1rem 0.2rem;
            }
          }
        }
      }
    }

    .suggest-wrapper {
      position: fixed;
      top: 1.7rem;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
    }
  }
</style>
