const NodeCache = require("node-cache");

/**
 * todo: discuss whether we should update the cache after every udpate operation or not.
 * implementation trivia:
 *      we get a clone by default from the cache. in case we want to update every time a
 *      change happens in the db, we may want to get the reference instead of a copy.
 */

class CacheManager {
  // The constructor was supposed to be private
  // Never call the constructor yourself -_-
  constructor() {
    this.cache = new NodeCache();
  }

  // call the getInstance function instead of the constructor
  static getInstance() {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }

    return CacheManager.instance;
  }

  /**
   * gets a value from the cache if it is in the cache, or sets it and then returns the value
   * @param {String} key: the key to search for
   * @param {asynchronus callback function} storeFunction: to be called to get the value for if not found in the cache
   * @param {integer} ttlSecond: time (in seconds) to keep the value in cache, defalut value is 30 minutes
   */
  async get(key, storeFunction, ttlSecond = 1800) {
    let value;

    if (this.cache.has(key)) {
      // the key was found in the cache
      value = this.cache.get(key);
      console.log(`key ${key} has been found in the cache.`);
    } else {
      // we didn't find the key in the array, so we resolve the value
      // and save it in the cache for later use
      value = await storeFunction();
      this.cache.set(key, value, ttlSecond);

      console.log(`key ${key} was not found in the cache.`);
    }

    return value;
  }

  // deletes some value from the cache
  del(keys) {
    this.cache.del(keys);
  }

  // flushes the whole cache
  flush() {
    this.cache.flushAll();
  }
}

module.exports = CacheManager;
