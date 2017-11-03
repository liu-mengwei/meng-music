export const singer = state => state.singer;

export const playing = state => state.playing;

export const fullScreen = state => state.fullScreen;

export const playMode = state => state.playMode;

export const songList = state => state.songList;

export const sequenceList = state => state.sequenceList;

export const currentIndex = state => state.currentIndex;

export const currentSong = (state) => {
  return state.songList[state.currentIndex] || {}
};

