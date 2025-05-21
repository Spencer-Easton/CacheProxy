/*
Copyright 2017 Spencer Easton

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
  * A Cache/Propertyservice Proxy
  */
class CacheProxy {
  /**
   * @param {Object} cacheService The Cache Service to use
   * @param {Object} propertyService The Properties Service to use
   */
  constructor(cacheService, propertyService) {
    this.cacheService_ = cacheService;
    this.propertyService_ = propertyService;
  }

  /**  
  *   Puts a Key,Val pair in the CacheProxy
  *   @param {string} key Key
  *   @param {string} val Value
  *   @return {CacheProxy} This CacheProxy instance for chaining.
  */
  put(key, val) {
    this.cacheService_.put(key, val, 21600);
    this.propertyService_.setProperty(key, JSON.stringify(val));
    return this;
  }

  /**  
  *   Get a value from the CacheProxy
  *   @param {string} key Key
  *   @return {string} value found in the cache
  */
  get(key) {
    let val = this.cacheService_.get(key);
    if (!val) {
      val = this.propertyService_.getProperty(key);
      try {
        val = JSON.parse(val)
      } catch (e) { }
      if (val) {
        this.cacheService_.put(key, val, 21600);
      }
    }
    return val;
  }

  /**  
  *   Remove a Key in the CacheProxy
  *   @param {string} key Key
  *   @return {CacheProxy} This CacheProxy instance for chaining.
  */
  remove(key) {
    this.cacheService_.remove(key);
    this.propertyService_.deleteProperty(key);
    return this;
  }

  /**  
  *   Adds an object into the CacheProxy
  *   @param {Object<string,string>} object An object with native key value pairs
  *   @return {CacheProxy} This CacheProxy instance for chaining.
  */
  putAll(object) {
    const stringifiedObject = {};
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        stringifiedObject[key] = JSON.stringify(object[key]);
      }
    }
    this.propertyService_.setProperties(stringifiedObject);
    this.cacheService_.putAll(stringifiedObject, 21600);
    return this;
  }

  /**  
  *   Get a array of values from the CacheProxy
  *   @param {Array<string>} keys An Array of Strings, if null gets all properties in CacheProxy
  *   @return {Object<string,string>} An object containing Key Value pairs
  */
  getAll(keys) {
    if (!keys) {
      keys = this.getKeys();
    }
    const newObj = {};
    for (const key of keys) {
      newObj[key] = this.get(key);
    }
    return newObj;
  }

  /**  
  *   Delete all values from the CacheProxy
  *   @param {Array<string>} keys An Array of Strings, if null deletes all properties in CacheProxy
  *   @return {CacheProxy} This CacheProxy instance for chaining.
  */
  removeAll(keys) {
    if (!keys) {
      keys = this.getKeys();
    }
    for (const key of keys) {
      this.remove(key);
    }
    return this;
  }

  /**  
  *   Get a array of Keys from the CacheProxy
  *   @return {Array<string>} An array containing Keys
  */
  getKeys() {
    return this.propertyService_.getKeys()
  }
}
