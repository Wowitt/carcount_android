/*
create by woody
date 20170301
账户页面controller
*/
angular.module('myapp').controller('LogoutCtrl',['$scope','Confirm','$ionicPopup','$state','localStorageService',function($scope,Confirm,$ionicPopup,$state,localStorageService) {

    $scope.showFlag = true;
    if(localStorageService.get("userType") != null && localStorageService.get("userType") != ""){
        if(localStorageService.get("userType") == "1"){
            $scope.showFlag = false;
        }
    }

    $scope.exit = function (){
        var data = {title:"提示",content:"是否确定退出？"};
        var result = Confirm.confirmTemplate(data,function(res){
            if(res) {
                console.log('You are sure');
                $state.go("tab.login");
            } else {
                console.log('You are not sure');
            }
        });
        //$ionicPopup.confirm({
        //    title: data.title,
        //    template: data.content,
        //    cancelText: '取消',
        //    okText: '确定'
        //}).then(function(res) {
        //    if(res) {
        //        console.log('You are sure');
        //        $state.go("tab.login");
        //    } else {
        //        console.log('You are not sure');
        //    }
        //});
    }

    $scope.checkHistory = function (){
        console.log('111111111');
        $state.go("tab.dealHistoryList");
        console.log('222222222');
    }

}])