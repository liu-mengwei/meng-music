import {modeType} from './config'

const state = {
  singer: {},
  playing: false, //是否正在播放
  fullScreen: false, //全屏
  playMode: modeType.sequence,
  songList: [],
  sequenceList: [],
  currentIndex: -1
};

export default state;
