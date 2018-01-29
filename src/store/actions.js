/**
 * Created by liumw on 2017/10/13.
 */
import * as types from './mutation-types'
import {saveSearch, removeSearch, removeAllSearch, saveLatestSongList, saveFavouriteList} from 'common/js/cache'

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
    let nextIndex = state.nextIndex;
    let playList = state.playList.slice(); //这里必须写一个副本

    //判断之前的列表里是否有这首歌 如果有则删除
    let index = findIndex(playList, song);

    if (nextIndex === -1) {
      //重置nextIndex
      nextIndex = currentIndex + 1;
    }

    //插入
    if (next) {
      playList.splice(++currentIndex, 0, song);
    } else {
      playList.splice(nextIndex, 0, song);
      if (nextIndex <= currentIndex) {
        currentIndex++;
      }
      nextIndex++;
    }

    //这里逻辑真的有点绕
    if (index >= 0) {
      if (index < nextIndex) {
        playList.splice(index, 1);
        nextIndex--;
      } else {
        //序号整体偏移了一个
        playList.splice(index + 1, 1);
      }

      if (index < currentIndex) {
        currentIndex--;
      }
    }

    commit(types.SET_PLAY_LIST, playList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    commit(types.SET_NEXT_INDEX, nextIndex);
    commit(types.SET_PLAYING, true);
  },

  //暂时不用这个 直接替换全部列表
  //insertSongList({commit, state}, songList){
  //  //插入整个列表
  //  songList.forEach((song) => {
  //    this._actions.insertSong[0]({song, next: false});
  //  });
  //
  //  let modeType = state.playMode;
  //  //顺序播放
  //  let currentSong = null;
  //  if (modeType === 0) {
  //    currentSong = songList[0];
  //  } else {
  //    let index = Math.floor((songList.length) * Math.random());
  //    currentSong = songList[index];
  //  }
  //
  //  let currentIndex = state.playList.findIndex((song) => {
  //    return currentSong.id === song.id;
  //  });
  //
  //  commit(types.SET_CURRENT_INDEX, currentIndex);
  //},

  removeSong({commit, state}, index){
    let currentIndex = state.currentIndex;
    let nextIndex = state.nextIndex;
    let playList = state.playList.slice(); //这里必须写一个副本
    let playing = true;

    playList.splice(index, 1);
    currentIndex = index < currentIndex ? currentIndex - 1 : currentIndex;
    nextIndex = index < nextIndex ? nextIndex - 1 : nextIndex;

    if (playList.length === 0) {
      playing = false;
      currentIndex = -1;
    }

    commit(types.SET_PLAY_LIST, playList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    commit(types.SET_NEXT_INDEX, nextIndex);
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
  },

  saveLatestSongList({commit}, song){
    let latestSongList = saveLatestSongList(song);
    commit(types.SET_LATEST_SONG_LIST, latestSongList);
  },

  saveFavouriteList({commit}, song) {
    let favouriteList = saveFavouriteList(song);
    commit(types.SET_FAVOURITE_LIST, favouriteList);
  }
};

export default actions;
