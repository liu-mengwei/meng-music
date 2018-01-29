/**
 * Created by liumw on 2017/10/13.
 */
import {getLyric, getVKey} from '../api/song'
import {ERR_OK} from '../api/config'
import {Base64} from 'js-base64'
import {getUid} from 'common/js/uid'

let urlMap = {};

export default class Song {
  constructor({id, mid, name, singer, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.name = name;
    this.singer = singer;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.filename = `C400${this.mid}.m4a`;
    this.url = url;

    // 确保一首歌曲的 id 只对应一个 url
    if (urlMap[this.id]) {
      this.url = urlMap[this.id]
    } else {
      this.genUrl()
    }
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric);
    } else {
      return getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric);
          return Promise.resolve(this.lyric);
        } else {
          return Promise.reject('no lyric');
        }
      })
    }
  }

  genUrl() {
    if (this.url) {
      return;
    }
    getVKey(this.mid, this.filename).then((res) => {
      if (res.code === ERR_OK) {
        const vkey = res.data.items[0].vkey;
        this.url = `http://dl.stream.qqmusic.qq.com/${this.filename}?vkey=${vkey}&guid=${getUid()}&uin=0&fromtag=66`
        urlMap[this.id] = this.url
      }
    })
  }
}

export function createSong({musicData}) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    name: musicData.songname,
    singer: normalize(musicData.singer),
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
  });
}

//localstorage存的不是song对象
export function wrapperToSongList(list) {
  let result = [];
  list.forEach((item) => {
    result.push(new Song(item));
  });
  return result;
}

function normalize(singerList) {
  let ret = [];

  if (!singerList) {
    ret = '';
  }

  singerList.forEach(singer => ret.push(singer.name));
  return ret.join('/');
}

