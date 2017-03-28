/*
Copyright 2017 Spencer Easton

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
  * A Cache/Propertyservice Proxy
  * @constructor
  * @param {Object} cacheService The Cache Service to use
  * @param {Object} propertyService The Properties Service to use
  * @return {Object} CacheProxy object
  */
var CacheProxy = function(cacheService,propertyService){
  this.cacheService_ = cacheService;
  this.propertyService_ = propertyService;
};


/**  
*   Puts a Key,Val pair in the CacheProxy
*   @param {string} key Key
*   @param {string} val Value
*   @return {Object} CacheProxy object for chaining
*/
CacheProxy.prototype.put = function(key,val){
  this.cacheService_.put(key,val,21600); 
  this.propertyService_.setProperty(key,val);
  return this;
};

/**  
*   Get a value from the CacheProxy
*   @param {string} key Key
*   @return {string} value found in the cache
*/
CacheProxy.prototype.get = function(key){
  var val = this.cacheService_.get(key);
  if(!val){
    val = this.propertyService_.getProperty(key);
    if (val){
      this.cacheService_.put(key,val,21600);
    }
  }
  return val;
}

/**  
*   Remove a Key in the CacheProxy
*   @param {string} key Key
*   @return {Object} CacheProxy object for chaining
*/
CacheProxy.prototype.remove = function(key){
  this.cacheService_.remove(key);
  this.propertyService_.deleteProperty(key);
  return this;
}

/**  
*   Adds an object into the CacheProxy
*   @param {Object<string,string>} object An object with native key value pairs
*   @return {Object} CacheProxy object for chaining
*/
CacheProxy.prototype.putAll = function(object){  
  this.propertyService_.setProperties(object)
  this.cacheService_.putAll(object,21600);
  return this;
}


/**  
*   Get a array of values from the CacheProxy
*   @param {Array<string>} keys An Array of Strings
*   @return {Object<string,string>} An object containing Key Value pairs
*/
CacheProxy.prototype.getAll = function(keys){
  var newObj = {};
  for(var k in keys){
    newObj[keys[k]] = this.get(keys[k])
  }
  return newObj;
}
