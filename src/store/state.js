import {modeType} from './config'
import {getSearchList} from 'common/js/cache'

const state = {
  singer: {},
  playing: false, //是否正在播放
  fullScreen: false, //全屏
  playMode: modeType.sequence,
  playList: [],
  sequenceList: [],
  currentIndex: -1,
  disc: {}, //推荐列表的那个对象
  searchHistoryList: getSearchList(), //查询历史
  nextIndex: -1
};

export default state;
