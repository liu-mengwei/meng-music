/**
 * Created by liumw on 2017/10/13.
 */
import * as types from './mutation-types'
import {saveSearch, removeSearch, removeAllSearch} from 'common/js/cache'

function findIndex(playList, song) {
  for (let i = 0; i < playList.length; i++) {
    if (playList[i].id === song.id) {
      return i;
    }
  }
  return -1;
}


const actions = {
  setPlayList({commit, state}, {songList, index}){
    console.log('songList', songList);
    commit(types.SET_PLAY_LIST, songList);
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_PLAYING, true);
  },

  clearPlayList({commit}){
    commit(types.SET_PLAY_LIST, []);
    commit(types.SET_CURRENT_INDEX, -1);
    commit(types.SET_PLAYING, false);
  },

  //第三个参数是是否偏移到下一位
  insertSong({commit, state}, {song, next}){
    let currentIndex = state.currentIndex;
    let playList = state.playList.slice(); //这里必须写一个副本
    let nextIndex = state.nextIndex;

    //判断之前的列表里是否有这首歌 如果有则删除
    let index = findIndex(playList, song);

    //插入
    if (next) {
      playList.splice(++currentIndex, 0, song);
    } else {
      playList.splice(++nextIndex, 0, song);
    }


    if (index >= 0) {
      if (index < currentIndex) {
        playList.splice(index, 1);
        currentIndex--;
        nextIndex--;
      } else {
        //序号整体偏移了一个
        playList.splice(index + 1, 1);
      }
    }

    commit(types.SET_PLAY_LIST, playList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    commit(types.SET_NEXT_INDEX, nextIndex);
    commit(types.SET_PLAYING, true);
  },

  removeSong({commit, state}, index){
    let currentIndex = state.currentIndex;
    let playList = state.playList.slice(); //这里必须写一个副本
    let playing = true;

    playList.splice(index, 1);
    if (index < currentIndex) {
      currentIndex--;
    }

    if (playList.length === 0) {
      playing = false;
      currentIndex = -1;
    }

    commit(types.SET_PLAY_LIST, playList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    commit(types.SET_PLAYING, playing);
  },

  saveSearch({commit}, query){
    let searches = saveSearch(query);
    commit(types.SET_SEARCH_HISTORY_LIST, searches);
  },

  removeSearch({commit}, query){
    let searches = removeSearch(query);
    commit(types.SET_SEARCH_HISTORY_LIST, searches);
  },

  removeAllSearch({commit}){
    removeAllSearch();
    commit(types.SET_SEARCH_HISTORY_LIST, []);
  }
};

export default actions;
