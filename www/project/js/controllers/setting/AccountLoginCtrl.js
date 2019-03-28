/*
create by woody
date 20170301
账户页面controller
*/
angular.module('myapp').controller('AccountLoginCtrl',['$scope','$rootScope','Alert','localStorageService','Init','$ionicLoading','JumpUtil','LoadUtil',function($scope,$rootScope,Alert,localStorageService,Init,$ionicLoading,JumpUtil,LoadUtil) {

    if(localStorageService.get("ifLogin") != undefined && localStorageService.get("ifLogin") != null && localStorageService.get("ifLogin") != "" && localStorageService.get("ifLogin") == "0"){
        var data={gotoData:{url:'carcount'}};
        JumpUtil.goFun(data);
        return;
    }
    $scope.carPlanName = '';
    $scope.carPlanNames = ['无'];
    $scope.init = function() {
        LoadUtil.showLoad('加载中');
        //Stop the ion-refresher from spinning
        Init.iwbhttp('/login/getCarPlan',  {}, function(data,header,config,status){
            if(data.carPlanName != ''){
                $scope.carPlanNames = ['无'];
                $scope.carPlanNames.push(data.carPlanName)
            }
            LoadUtil.hideLoad();
        },function(data,header,config,status){
            LoadUtil.hideLoad();
            Alert.myToastBottom({mess: "服务器未知异常", height: -160});
        });
    };
    $scope.init();
    $scope.login = function(){
        if($("#username").val() == null || $("#username").val() == ""){
            /*Alert.alertTemplate({title:"提示",content:"请输入用户名"},function(res){
            });*/
            Alert.myToastBottom({mess: "请输入用户名", height: -160});
            return;
        }
        if($("#pwd").val() == null || $("#pwd").val() == ""){
            /*Alert.alertTemplate({title:"提示",content:"请输入密码"},function(res){
            });*/
            Alert.myToastBottom({mess: "请输入密码", height: -160});
            return;
        }
        LoadUtil.showLoad('登录中');
        Init.iwbhttp("/login/loginForPDA",{userId:$("#username").val(), userPwd:$("#pwd").val()},function(data,header,config,status){
            if(data.resFlag == "0"){
                var data={gotoData:{}};
                data.gotoData.url = 'carcount';
                data.gotoData.param = {"data": {"carPlanName":$("#carPlanId").val().substr(7)}};
                LoadUtil.hideLoad();
                JumpUtil.goFun(data);
                $("#pwd").val("");
            }else{
				LoadUtil.hideLoad();
                /*Alert.alertTemplate({title:"提示",content:data.msg},function(res){
                });*/
                Alert.myToastBottom({mess: data.msg, height: -160});
            }
        },function(data,header,config,status){
            LoadUtil.hideLoad();
            Alert.myToastBottom({mess: "服务器未知异常", height: -160});
        });
    }

    //返回上一页
    $scope.myGoBack=function()
    {
        JumpUtil.goBackFun();
    }
}])
