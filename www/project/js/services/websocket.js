/**
 * Created by woody on 2015/12/12.
 */
angular.module('myapp').factory('WebSocket', ['$websocket', '$rootScope','$state','localStorageService','$cordovaGeolocation','Gis', function($websocket, $rootScope,$state,localStorageService,$cordovaGeolocation,Gis) {
	var IWBSESSION  = localStorageService.get('IWBSESSION');
  var wsurl = $rootScope.websocketUrl+$rootScope.websocketController+'?IWBSESSION='+IWBSESSION;
//   alert('$rootScope.websocketUrlController==>>'+wsurl+"11111");
  var ws = $websocket(wsurl);
  var collection = [];
  ws.onMessage(function(event) {
    var res;
    try {
      res = (new Function("return " + event.data))();
      if(res.key == '1')
      {
        Gis.getLocationTest(res,function(paramMsg){ws.send(paramMsg);});
      }
    } catch(e) {
      res = {
        'userId': $rootScope.userId,
        'message': event.data
      };
    }
  });
  ws.onError(function(event) {
    console.log('connection Error', event);
  });
  ws.onClose(function(event) {
    console.log('connection closed', event);
  });
  ws.onOpen(function() {
    console.log('connection open');
  });
  return {
    collection: collection,
    status: function() {
      return ws.readyState;
    },
    send: function(message) {
      if (angular.isString(message))
      {
        ws.send(message);
      }
      else if (angular.isObject(message))
      {
        ws.send(JSON.stringify(message));
      }
    }
  };
}]);
