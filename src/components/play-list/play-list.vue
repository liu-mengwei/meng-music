<template>
  <transition name="fade">
    <div class="play-list" v-show="showFlag" @click="hide">
      <div class="content-wrapper" @click.stop>
        <div class="content">
          <div class="content-header">
            <div class="mode-wrapper l" @click="toggleMode">
              <i class="mode-icon icon" :class="modeCls"></i>
              <span class="mode-txt">{{modeText}}</span>
              <span class="song-num">({{playList.length}})</span>
            </div>
            <i class="clear-btn r fa fa-trash" @click="openConfirm"></i>
          </div>
          <scroll class="content-middle" :data="playList" ref="contentMiddle">
            <transition-group tag="ul" name="remove">
              <li :key="song.id" class="song-item" @click.stop="selectSong(index)"
                  ref="songItem"
                  v-for="(song,index) in playList">
                <div class="item-left">
                  <div class="song-num">{{index + 1}}</div>
                  <div class="cd-wrapper">
                    <img class="cd-image" :src="currentSong.image" :class="cdCls" v-show="currentSong.id === song.id">
                  </div>
                </div>
                <div class="item-right">
                  <div class="song-name l">{{song.name}} - {{song.singer}}</div>
                  <div class="song-delete fa fa-trash r" @click.stop="removeSongItem(index)"></div>
                </div>
              </li>
            </transition-group>
          </scroll>
          <div class="content-bottom">
            <div class="add-songs">
              <span class="fa fa-plus"></span>
              <span class="add-txt">添加歌曲到队列</span>
            </div>
          </div>
        </div>
        <div class="close" @click="hide">关闭</div>
      </div>
      <confirm @confirm="removeAllPlayList" ref="confirm" confirmText="确定清空播放队列？"></confirm>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll'
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import Confirm from 'base/confirm/confirm'
  import {getModeCls, getModelText} from '../../common/js/playMode'

  export default {
    data(){
      return {
        showFlag: false
      }
    },

    methods: {
      hide(){
        this.showFlag = false;
      },
      show(){
        this.showFlag = true;
      },

      openConfirm(){
        this.$refs.confirm.toggle();
      },

      removeAllPlayList(){
        this.clearPlayList();
        this.hide();
      },

      selectSong(index){
        if (index === this.currentIndex) {
          this.setPlaying(!this.playing);
        } else {
          this.setCurrentIndex(index);
        }
      },

      toggleMode(){
        let playMode = this.playMode;
        if (++playMode > 2) {
          playMode = 0;
        }
        this.setPlayMode(playMode);
      },

      removeSongItem(index){
        this.removeSong(index);
        if (this.playList.length === 0) {
          this.hide();
        }
      },

      scrollToSong(){
        if (this.currentIndex > 2) {
          this.$refs.contentMiddle.scrollToElement(this.$refs.songItem[this.currentIndex - 2], 1000);
        }
      },

      ...mapActions([
        'clearPlayList',
        'removeSong'
      ]),

      ...mapMutations({
        'setCurrentIndex': 'SET_CURRENT_INDEX',
        'setPlayMode': 'SET_PLAY_MODE',
        'setPlaying': 'SET_PLAYING'
      })
    },

    computed: {
      //播放图标样式
      modeCls(){
        return getModeCls(this.playMode);
      },

      cdCls(){
        return this.playing ? 'rotate' : 'rotate pause';
      },

      modeText(){
        return getModelText(this.playMode);
      },

      ...mapGetters(['playList', 'currentSong', 'playing', 'playMode', 'currentIndex'])
    },

    watch: {
      showFlag(){
        setTimeout(() => {
          this.$refs.contentMiddle.refresh();
          this.scrollToSong();
        }, 20);
      },

      currentSong(){
        this.scrollToSong();
      }
    },

    components: {
      Scroll,
      Confirm
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../common/scss/variable";
  @import "../../common/scss/font-awesome.min.css";
  @import "../../common/scss/icon.css";
  @import "../../common/scss/mixin";

  .play-list {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 300;

    &.fade-enter, &.fade-leave-to {
      opacity: 0;
      .content-wrapper {
        transform: translateY(100%);
      }
    }
    &.fade-leave, &.fade-enter-to {
      opacity: 1;
      .content-wrapper {
        transform: translateY(0);
      }
    }
    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.3s ease;
      .content-wrapper {
        transition: all 0.3s ease;
      }
    }

    .content-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 300;
      background: #222;

      .content {
        .content-header {
          border-bottom: 1px solid rgba(100, 100, 100, 0.3);
          padding-right: 0.2rem;
          @include clearfix();

          .mode-wrapper {
            padding: 0.13rem 0.2rem;
            color: $color-theme;
            .mode-icon {
              font-size: $font-size-large-x;
              vertical-align: middle;
              margin-right: 0.1rem;
            }
          }

          .clear-btn {
            font-size: $font-size-medium-x;
            line-height: 0.5rem;
          }
        }

        .content-middle {
          max-height: 2.9rem;

          .song-item {
            display: flex;
            align-items: center;
            overflow: hidden;
            height: 0.57rem;

            &.remove-leave-active {
              transition: all 0.2s ease;
            }

            &.remove-leave-to {
              height: 0;
            }

            .item-left {
              flex: 0 0 auto;
              @include square(0.56rem);
              position: relative;
              text-align: center;

              .cd-wrapper {
                @include square(0.38rem);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);

                .cd-image {
                  border-radius: 50%;
                  width: 100%;
                }
              }

              .song-num {
                @include line-height(0.2rem);
                @include vertical-center();
              }
            }

            .item-right {
              flex: 1 1 auto;
              padding: 0.18rem 0.2rem 0.18rem 0;
              overflow: hidden;
              border-bottom: 1px solid rgba(100, 100, 100, 0.3);

              .song-name {
                display: inline-block;
                width: 90%;
                @include line-height(0.2rem);
                @include nowrap();
              }
              .song-delete {
                line-height: 0.2rem;
                font-size: $font-size-medium-x;
              }
            }
          }
        }

        .content-bottom {
          text-align: center;
          padding: 0.05rem 0;

          .add-songs {
            border: 1px solid rgba(255, 205, 50, 0.3);
            display: inline-block;
            padding: 0.1rem 0.2rem;
            border-radius: 0.2rem;
            color: $color-theme;
            margin-top: 0.05rem;
          }
        }
      }

      .close {
        background: #000;
        @include line-height(0.5rem);
        text-align: center;
        margin-top: 0.1rem;
      }
    }
  }

</style>
