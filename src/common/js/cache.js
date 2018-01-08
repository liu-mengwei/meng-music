import storage from 'good-storage'

const SEARCH_MAX_LENGTH = 15;
const SEARCH_KEY = '__search__';

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
    arr.unshift(query);
    if (arr.length > length) {
      arr.pop();
    }
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

export function getSearchList() {
  return storage.get(SEARCH_KEY, []);
}
