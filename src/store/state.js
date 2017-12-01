import {modeType} from './config'

const state = {
  singer: {},
  playing: false, //是否正在播放
  fullScreen: false, //全屏
  playMode: modeType.sequence,
  playList: [],
  sequenceList: [],
  currentIndex: -1,
  disc: {} //推荐列表的那个对象
};

export default state;
