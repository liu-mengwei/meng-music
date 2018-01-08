/**
 * Created by liumw on 2017/10/13.
 */
import {getLyric} from '../api/song'
import {ERR_OK} from '../api/config'
import {Base64} from 'js-base64'


export default class Song {
  constructor({id, mid, name, singer, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.name = name;
    this.singer = singer;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
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
}

export function createSong({musicData}) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    name: musicData.songname,
    singer: normalize(musicData.singer),
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  });
}

function normalize(singerList) {
  let ret = [];

  if (!singerList) {
    ret = '';
  }

  singerList.forEach(singer => ret.push(singer.name));
  return ret.join('/');
}
