<template>
  <ul class="song-list">
    <li class="song-item" @click="selectSong(item,index)" v-for="(item,index) in songList">
      <h1 class="song-name">{{item.name}}</h1>
      <span class="song-singer">{{item.singer}} -《{{item.album}}》</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  import {mapActions} from 'vuex';


  export default {
    props: {
      songList: {
        type: Array,
        default: []
      }
    },

    methods: {
      selectSong(item, index){
        this.setPlayList({songList: this.songList, index});
      },

      ...mapActions([
        'setPlayList'
      ])
    }
  };


</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../common/scss/variable";

  .song-list {
    .song-item {
      padding: 0.12rem 0;
      border-bottom: 1px solid rgba(70, 70, 70, 0.2);

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
</style>
