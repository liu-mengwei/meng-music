<template>
  <scroll class="suggest"
          ref="suggestScroll"
          :data="suggestList"
          :listenPullUp="listenPullUp"
          :listenBeforeScroll="listenBeforeScroll"
          @beforeScrollStart="onBeforeScrollStart"
          @scrollToEnd="searchMore">
    <div class="content-wrapper">
      <div class="singer" v-show="singer.name" @click="selectSinger()">
        <div class="img-container">
          <i class="instead-img fa fa-user-circle-o"></i>
          <img class="singer-img" :src="singer.avatar">
        </div>
        <div class="singer-desc">
          <div class="singer-name">{{singer.name}}</div>
          <span class="song-num" v-show="singer.songnum">单曲：{{singer.songnum}}</span>
          <span class="album-num" v-show="singer.albumnum">专辑：{{singer.albumnum}}</span>
        </div>
      </div>
      <ul class="suggest-wrapper">
        <li class="suggest-item"
            :class="{'selected':currentSong.id === suggest.id}"
            v-for="suggest in suggestList"
            @click="selectSong(suggest)">
          <div class="selected-sign" v-show="currentSong.id === suggest.id"></div>
          <span class="item-icon fa fa-music"></span>
          <div class="item-content">
            <div class="song-name">{{suggest.name}}</div>
            <div class="singer-name">{{suggest.singer}}</div>
          </div>
        </li>
      </ul>
      <loading class="loading" v-show="hasMore"></loading>
    </div>
    <div class="noResult-wrapper" v-show="query && !hasMore && suggestList.length === 0">
      <no-result></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import Scroll from 'base/scroll'
  import {ERR_OK} from 'api/config'
  import Singer from 'class/Singer'
  import Song, {createSong} from 'class/Song'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import {mapMutations, mapActions, mapGetters} from 'vuex'

  const ROWS = 20;

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },

      showSinger: {
        type: Boolean,
        default: true
      }
    },

    data(){
      return {
        suggestList: [],
        page: 1,
        singer: {},
        listenPullUp: true,
        listenBeforeScroll: true,
        hasMore: true
      }
    },

    methods: {
      search(){
        //重置
        this.page = 1;
        this.hasMore = true;
        this.$refs.suggestScroll.scrollTo(0, 0);
        this.suggestList = [];

        search(this.query, this.page, this.showSinger, ROWS).then((ret) => {
          if (ret.code === ERR_OK) {
            this.singer = this._normalLizeSinger(ret.data);
            this.suggestList = this._normalLizeSuggest(ret.data);
            this.checkHasMore(ret.data.song);
          }
        });
      },

      //上拉刷新
      searchMore(){
        if (!this.hasMore) {
          return;
        }

        this.page++;
        search(this.query, this.page, this.showSinger, ROWS).then((ret) => {
          if (ret.code === ERR_OK) {
            console.log(ret);
            this.suggestList = this.suggestList.concat(this._normalLizeSuggest(ret.data));
            this.checkHasMore(ret.data.song);
          }
        });
      },

      checkHasMore(song){
        if (!song || !song.list.length || ROWS * song.curpage >= song.totalnum) {
          this.hasMore = false;
        }
      },

      selectSinger(){
        this.$router.push(`/search/${this.singer.id}`);
        this.setSinger(this.singer);
        this.$emit('select', this.singer.name);
      },

      selectSong(song){
        this.insertSong({song, next: true});
        this.$emit('select', song.name);
      },

      onBeforeScrollStart(){
        this.$emit('beforeScrollStart');
      },

      refresh(){
        this.$refs.suggestScroll.refresh();
      },

      //处理是有zhida的情况
      _normalLizeSuggest(data){
        let ret = [];
        if (data.song && data.song.list.length > 0) {
          data.song.list.forEach((item) => {
            ret.push(createSong({musicData: item}));
          });
        }
        return ret;
      },

      _normalLizeSinger(data){
        let singer = {};
        if (data.zhida && data.zhida.singerid) {
          let tmp = data.zhida;
          singer = new Singer(tmp.singermid, tmp.singername, tmp.songnum, tmp.albumnum);
        }
        return singer;
      },

      ...mapMutations({'setSinger': 'SET_SINGER'}),
      ...mapActions(['insertSong'])
    },

    computed: {
      ...mapGetters(['currentSong'])
    },

    watch: {
      query(){
        this.search();
      }
    },

    components: {
      Scroll,
      Loading,
      NoResult
    }
  };


</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../common/scss/variable";
  @import "../../common/scss/mixin";

  .suggest {
    color: rgba(255, 255, 255, 0.4);
    height: 100%;

    .content-wrapper {
      .singer {
        display: flex;
        align-items: center;
        padding-bottom: 0.12rem;
        padding-left: 0.18rem;
        border-bottom: 1px solid rgba(180, 180, 180, 0.1);

        .img-container {
          @include square(0.5rem);
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          margin-right: 0.15rem;

          .instead-img {
            position: absolute;
            left: 0;
            font-size: 0.5rem;
          }

          .singer-img {
            width: 100%;
            position: absolute;
            left: 0;
            z-index: 10;
          }
        }

        .singer-desc {
          .singer-name {
            font-size: $font-size-medium;
            color: $color-text-ll;
            margin-bottom: 0.03rem;
          }

          .song-num, .album-num {
            font-size: $font-size-small;
            margin-right: 0.08rem;
          }
        }
      }
      .suggest-wrapper {
        .suggest-item {
          display: flex;
          @include nowrap();
          align-items: center;

          .selected-sign {
            width: 0.04rem;
            background: $color-theme;
            flex: 0 0 auto;
            align-self: stretch;
          }

          &.selected {
            .item-icon {
              color: $color-theme;
            }

            .item-content {
              .song-name, .singer-name {
                color: $color-theme;
              }
            }
          }

          .item-icon {
            font-size: 0.2rem;
            margin-right: 0.15rem;
            margin-left: 0.3rem;
            flex: 0 0 auto;
          }

          .item-content {
            padding: 0.12rem 0;
            margin-right: 0.2rem;
            flex: 1 1 auto;
            border-bottom: 1px solid rgba(180, 180, 180, 0.1);

            .song-name {
              margin-bottom: 0.05rem;
              font-size: $font-size-medium;
              color: $color-text-ll;
              @include nowrap();
            }

            .singer-name {
              font-size: 0.12rem;
            }
          }
        }
      }
      .loading {
        padding: 0.2rem;
        text-align: center;
      }
    }

    .noResult-wrapper {
      height: 100%;
      width: 100%;
    }

  }


</style>
