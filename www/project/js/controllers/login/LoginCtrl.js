/*
create by woody
date 20170301
账户页面controller
*/
angular.module('myapp').controller('LoginCtrl',['$scope','$state',function($scope,$state) {
    $scope.accountLogin = function(){
        console.log("11111111");
        $state.go("tab.accountLogin");
        console.log("22222222");
    }

}])