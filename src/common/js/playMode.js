import {modeType} from '../../store/config'

// 根据播放模式返回相应的字符串
export function getModeCls(playMode) {
  let mode = 'icon-';
  switch (playMode) {
    case modeType.sequence:
      mode += 'sequence';
      break;
    case modeType.random:
      mode += 'random';
      break;
    case modeType.loop:
      mode += 'loop';
      break;
  }
  return mode;
}

export function getModelText(playMode) {
  let ret = '';
  switch (playMode) {
    case modeType.sequence:
      ret = '顺序播放';
      break;
    case modeType.random:
      ret = '随机播放';
      break;
    case modeType.loop:
      ret = '单曲循环';
      break;
  }
  return ret;
}
