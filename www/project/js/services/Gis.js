/**
 * Created by woody on 2015/12/12.
 */
angular.module('myapp').factory('Gis', ['$rootScope','$state','localStorageService','$cordovaGeolocation', function($rootScope,$state,localStorageService,$cordovaGeolocation) {
    //timeout单位毫秒，定一分钟是配合后台定时任务，让移动设备在后台第一次请求后一直获取当前定位信息，后期测试后在设置最佳时长；enableHighAccuracy为高精度
    var posOptions = {timeout: 60000, enableHighAccuracy: true};
    var gisRes = {
      getLocationTest : function(data,myCallback){
        var msg = {};
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
          var location = {latitude: position.coords.latitude, longitude: position.coords.longitude};
          msg = {
            key: data.key,
            res: "0",
            info: {
              sessionId: localStorageService.get('IWBSESSION'),
              userId: localStorageService.get("userId"),
              roleType: localStorageService.get("roleType"),
              epId: localStorageService.get("epId"),
              epName: localStorageService.get("epName"),
              location: JSON.stringify(location)
            }
          };
          if (typeof myCallback === "function"){
            myCallback(msg);
          }
        }, function(err) {
          msg = {
            key:data.key,
            res:"1"
          };
          if (typeof myCallback === "function"){
            myCallback(msg);
          }
        });
        //       navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 5000 });
      }
    };
    return gisRes;
}]);
