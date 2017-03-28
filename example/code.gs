function myFunction() {
  
  var cs = new CacheProxy(CacheService.getScriptCache(),PropertiesService.getUserProperties());
  
  cs.put("key1","val1");
  Logger.log(cs.get("key1")) //val1
  
  cs.putAll({key2:"val2",key3:"val3",key4:"val4",})
  Logger.log(cs.getAll(["key1","key2","key3","key4"])) //{key1=val1, key2=val2, key3=val3, key4=val4}
  
  cs.remove("key2");  
  Logger.log(cs.getAll(["key1","key2","key3","key4"])) //{key1=val1, key2=null, key3=val3, key4=val4}
  
  Logger.log(cs.get("fubar")) //null
}

