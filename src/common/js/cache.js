import storage from 'good-storage'

const SEARCH_MAX_LENGTH = 15;
const FAVOURITE_MAX_LENGTH = 500;
const SEARCH_KEY = '__search__';
const LATEST_KEY = '__latest__';
const FAVOURITE_KEY = '__favourite__';

/**
 * @description 处理数组插入的特殊逻辑
 * @param arr 被插入的数组
 * @param query 要插入的选项
 * @param compare 判断是否重复的逻辑
 * @param length 最大长度
 */
export function insertArray(arr, query, compare, length) {
  let index = arr.findIndex(compare);

  if (index > 0) {
    arr.splice(index, 1);
    arr.unshift(query);
  }

  if (index === -1) {
    if (arr.length === length) {
      arr.pop();
    }
    arr.unshift(query);
  }

  return arr;
}

export function removeArray(arr, compare) {
  let index = arr.findIndex(compare);

  if (index >= 0) {
    arr.splice(index, 1);
  }
  return arr;
}


export function saveSearch(query) {
  query = query.trim();
  let searches = storage.get(SEARCH_KEY, []);

  searches = insertArray(searches, query, function (item) {
    return item === query;
  }, SEARCH_MAX_LENGTH);

  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function removeSearch(query) {
  query = query.trim();
  let searches = storage.get(SEARCH_KEY, []);

  searches = removeArray(searches, (item) => {
    return item === query;
  });

  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function removeAllSearch() {
  storage.set(SEARCH_KEY, []);
}
export function saveLatestSongList(song) {
  //从这里出来的已经不是song对象了
  let latestSongList = storage.get(LATEST_KEY, []);

  latestSongList = insertArray(latestSongList, song, function (item) {
    return item.id === song.id;
  }, SEARCH_MAX_LENGTH);

  storage.set(LATEST_KEY, latestSongList);
  return latestSongList;
}

export function saveFavouriteList(song) {
  let favouriteList = storage.get(FAVOURITE_KEY, []);
  let index = favouriteList.findIndex((item) => {
    return item.id === song.id;
  });
  if (index >= 0) {
    favouriteList.splice(index, 1);
  } else {
    favouriteList.unshift(song);
  }

  storage.set(FAVOURITE_KEY, favouriteList);
  return favouriteList;
}

export function getSearchList() {
  return storage.get(SEARCH_KEY, []);
}

export function getFavouriteList() {
  return storage.get(FAVOURITE_KEY, []);
}

export function getLatestList() {
  return storage.get(LATEST_KEY, []);
}
