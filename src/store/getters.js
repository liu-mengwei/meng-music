import {wrapperToSongList} from 'class/Song'


export const singer = state => state.singer;

export const playing = state => state.playing;

export const fullScreen = state => state.fullScreen;

export const playMode = state => state.playMode;

export const playList = state => state.playList;

export const sequenceList = state => state.sequenceList;

export const currentIndex = state => state.currentIndex;

export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
};

export const disc = state => state.disc;

export const searchHistoryList = state => state.searchHistoryList;

export const latestSongList = (state) => {
  return wrapperToSongList(state.latestSongList);
};

export const favouriteList = (state) => {
  return wrapperToSongList(state.favouriteList);
};




