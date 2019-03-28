/*
create by woody
date 20170301
账户页面controller
*/
angular.module('myapp').controller('TabsCtrl',['$scope','Confirm','$ionicPopup','$state','localStorageService','Alert','Init','JumpUtil','WebSocket',function($scope,Confirm,$ionicPopup,$state,localStorageService,Alert,Init,JumpUtil,WebSocket) {
    $scope.set = function(){
        //$state.go("tab.setting",{reload:true});
        var data={gotoData:{url:'tab.setting'}};
        JumpUtil.goFun(data);
    }
    $scope.WebSocket = WebSocket;
}])
