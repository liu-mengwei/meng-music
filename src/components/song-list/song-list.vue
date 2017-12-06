<template>
  <ul class="song-list">
    <li class="song-item"
        :class="{'selected':currentSong.id === item.id}"
        @click="selectSong(item,index,$event)"
        v-for="(item,index) in songList">
      <div class="selected-sign" v-show="currentSong.id === item.id"></div>
      <i class="plus fa fa-plus-square-o"></i>
      <div class="rank-img" v-show="rank && index < 3" :class="getRankBg(index + 1)"></div>
      <span class="rank-num" v-show="rank && index >= 3">{{index + 1}}</span>
      <i class="musicSign fa fa-music"></i>
      <div class="content-wrapper">
        <h1 class="song-name">{{item.name}}</h1>
        <span class="song-singer" v-text="songSingerTxt(item)"></span>
      </div>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import {touchFeedBack} from 'common/js/dom'
  import $ from 'jquery'

  export default {
    props: {
      songList: {
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      selectSong(item, index, e){
        //todo 有什么更好的办法
        touchFeedBack(e.currentTarget);

        //如果是选中已经播放的歌曲 则会暂停
        if (this.currentSong && this.currentSong.id === item.id) {
          this.setPlaying(!this.playing);
        } else {
          //滚落动画
          this._startRollDown($(e.currentTarget).children('.musicSign'));
          this.setPlayList({songList: this.songList, index});
        }
      },

      songSingerTxt(item){
        let ret = '';
        if (item.singer) {
          ret += item.singer + ' ';
        }
        if (item.album && item.album.trim() !== '') {
          ret += ` -《${item.album}》`;
        }
        return ret;
      },

      getRankBg(index){
        let bg = '';
        if (index === 1) {
          bg = 'first';
        }
        if (index === 2) {
          bg = 'second';
        }
        if (index === 3) {
          bg = 'third';
        }
        return bg;
      },

      _startRollDown(el){
        let distance = window.innerHeight - el.offset().top;
        let top = el.position().top;

        el.css('visibility', 'visible');
        //不支持transfrom属性
        el.animate({top: `${distance}px`}, 1000, 'swing', function () {
          el.css('top', `${top}px`);
          el.css('visibility', 'hidden');
        });
      },


      ...mapActions([
        'setPlayList'
      ]),

      ...mapMutations({
        'setPlaying': 'SET_PLAYING'
      })

    },

    computed: {
      ...mapGetters(['currentIndex', 'currentSong', 'playing'])
    }

  };


</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../common/scss/variable";
  @import "../../common/scss/font-awesome.min.css";
  @import "../../common/scss/mixin";

  .song-list {
    .song-item {
      position: relative;
      display: flex;
      align-items: center;

      &.selected {
        .content-wrapper {
          .song-name, .song-singer {
            color: $color-theme;
          }
        }
      }

      &.bg-selected {
        background: rgba(100, 100, 100, 0.3);
      }

      .selected-sign {
        width: 0.04rem;
        background: $color-theme;
        flex: 0 0 auto;
        align-self: stretch;
      }

      .rank-img {
        margin-left: 0.25rem;
        @include square(0.2rem);
        background-size: contain;

        &.first {
          @include bg-img('first')
        }

        &.second {
          @include bg-img('second')
        }

        &.third {
          @include bg-img('third')
        }
      }

      .rank-num {
        margin-left: 0.29rem;
        margin-right: 0.05rem;
        color: $color-theme;
        font-size: $font-size-large;
      }

      .plus {
        flex: 0 0 auto;
        margin-left: 0.25rem;
        font-size: 0.16rem;
      }

      .fa-music {
        color: $color-theme;
        position: absolute;
        left: 0.05rem;
        visibility: hidden;
      }

      .content-wrapper {
        padding: 0.125rem 0.1rem 0.125rem 0;
        margin-left: 0.2rem;
        border-bottom: 1px solid rgba(70, 70, 70, 0.3);
        flex: 1 1 auto;

        .song-name {
          color: #fff;
          font-size: 0.14rem;
          margin-bottom: 0.1rem;
        }

        .song-singer {
          color: $color-text-d;
        }
      }
    }
  }
</style>
