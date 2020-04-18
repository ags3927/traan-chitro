const NodeCache = require("node-cache");
const cache = new NodeCache();

const get = (key) => {
  const defaultValue = {
    found: false,
    data: null,
  };

  try {
    if (cache.has(key)) {
      return {
        found: true,
        data: cache.get(key),
      };
    }
  } catch (err) {
    console.log(err);
  }

  return defaultValue;
};

const setWithExpiration = (key, val, expirationTimeInSeconds) => {
  let status = "OK";

  try {
    cache.set(key, val, expirationTimeInSeconds);
  } catch (err) {
    status = "Error";
  }

  return { status };
};

const set = (key, val) => setWithExpiration(key, val, 0); // 0 means unlimited expiration in node-cache

const del = (key) => cache.del(key);

const flush = () => cache.flushAll();

module.exports = {
  get,
  set,
  setWithExpiration,
  del,
  flush,
};
