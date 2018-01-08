<template>
  <div class="rank" ref="rank">
    <scroll class="rank-wrapper" :data="topList" ref="rankWrapper">
      <ul class="topList-container">
        <li class="top-item" v-for="top in topList" @click="selectTop(top)">
          <div class="img-wrapper l">
            <img :src="top.picUrl">
          </div>
          <div class="top-content l">
            <ul class="songList-wrapper" v-show="top.songList && top.songList.length>0">
              <li class="song" v-for="(song, index) in top.songList">
                <span class="num">{{index + 1}}</span>
                <span class="song-name">{{song.songname}}</span>
                <span class="singer-name" v-show="song.singername"> - {{song.singername}}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll'
  import {getTopList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {miniPlayMixin} from 'common/js/mixin'

  export default {
    mixins: [miniPlayMixin],
    data() {
      return {
        topList: []
      }
    },

    created(){
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      })
    },

    methods: {
      selectTop(top){
        this.$router.push('/rank/' + top.id);
      },


      handleMiniPlay(){
        let bottom = 0;
        if (this.playList.length > 0) {
          bottom = '0.7rem';
        }

        this.$refs.rank.style['bottom'] = bottom;
        this.$refs.rankWrapper.refresh();

      }
    },

    components: {
      Scroll
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  @import '../../common/scss/mixin';
  @import "../../common/scss/variable";

  .rank {
    position: fixed;
    top: 0.9rem;
    left: 0;
    right: 0;
    bottom: 0;

    .rank-wrapper {
      height: 100%;

      .topList-container {
        padding: 0 0.22rem;
        /*解决外边距合并*/
        overflow: hidden;

        .top-item {
          margin-bottom: 0.18rem;
          height: 0.9rem;

          .img-wrapper {
            width: 27%;

            img {
              width: 100%;
            }
          }

          .top-content {
            height: 100%;
            width: 73%;
            padding: 0 0.2rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: $font-size-small;
            color: $color-text-l;
            background: $color-highlight-background;

            .songList-wrapper {
              .song {
                @include nowrap();
                margin-bottom: 0.08rem;
              }
              .song:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
      }
    }
  }
</style>
