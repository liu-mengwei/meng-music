/**
 * Created by liumw on 2017/10/13.
 */
import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer){
    state.singer = singer;
  },

  [types.SET_PLAYING](state, playing){
    state.playing = playing;
  },

  [types.SET_FULLSCREEN](state, fullScreen){
    state.fullScreen = fullScreen;
  },

  [types.SET_PLAY_MODE](state, playMode){
    state.playMode = playMode;
  },

  [types.SET_PLAY_LIST](state, songList){
    state.playList = songList;
  },

  [types.SET_SEQUENCE_LIST](state, sequenceList){
    state.sequenceList = sequenceList;
  },

  [types.SET_CURRENT_INDEX](state, index){
    state.currentIndex = index;
  },

  [types.SET_DISC](state, disc){
    state.disc = disc;
  }
};

export default mutations;
