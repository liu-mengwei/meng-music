/**
 * Created by liumw on 2017/10/10.
 */
export default class Singer {
  constructor(id, name, songnum, albumnum) {
    this.id = id;
    this.name = name;
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`;
    this.songnum = songnum;
    this.albumnum = albumnum;
  }
}
