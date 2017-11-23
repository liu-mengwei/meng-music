/**
 * Created by liumw on 2017/10/13.
 */
import * as types from './mutation-types'


const actions = {
  setPlayList({commit, state}, {songList, index}){
    console.log('songList', songList);
    commit(types.SET_SONG_LIST, songList);
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_PLAYING, true);
  }
};


export default actions;
