/*
create by woody
date 20170301
账户页面controller
*/
angular.module('myapp').controller('SettingCtrl',['$scope','Confirm','$ionicPopup','$state','localStorageService','Alert','Init','$rootScope','JumpUtil','LoadUtil',function($scope,Confirm,$ionicPopup,$state,localStorageService,Alert,Init,$rootScope,JumpUtil,LoadUtil) {
    if(localStorageService.get("ifLogin") == undefined || localStorageService.get("ifLogin") == null || localStorageService.get("ifLogin") == "" || localStorageService.get("ifLogin") != "0"){
        //console.log("setting====>"+localStorageService.get("ifLogin"));
        //$state.go("tab.login");
        var data={gotoData:{url:'login'}};
        JumpUtil.goFun(data);
        return;
    }
    //历史处理记录显示标志
    //$scope.showFlag = true;
    $scope.username = localStorageService.get("nickName");
    $scope.epName = localStorageService.get("epName");
    $scope.role = "现场处置人员";
    if(localStorageService.get("roleType") != null && localStorageService.get("roleType") != ""){
        //console.log("roleType====>"+localStorageService.get("roleType"));
        if(localStorageService.get("roleType") == "1"){
            //$scope.showFlag = false;
            $scope.role = "司机";
        }else if(localStorageService.get("roleType") == "4"){
            $scope.role = "管理员";
        }
    }

    //退出登录
    $scope.exit = function (){
        var data = {title:"提示",content:"是否确定退出？"};
        var result = Confirm.confirmTemplate(data,function(res){
            if(res) {
                LoadUtil.showLoad('注销中');
                //console.log('You are sure');
                Init.iwbhttp("/user/logout",{},function(data,header,config,status){
                    if(data.resFlag == "0"){
                        localStorageService.clearAll();
                        //console.log("out===>"+localStorageService.get('IWBSESSION'));
                        var data={gotoData:{url:'login'}};
                        Alert.myToastBottom({mess: "注销成功", height: -160});
                        JumpUtil.goFun(data);
                    }else{
                        /*Alert.alertTemplate({title:"提示",content:data.msg},function(res){
                        });*/
                        Alert.myToastBottom({mess: data.msg, height: -160});
                    }
                    LoadUtil.hideLoad();
                },function(data,header,config,status){
                    var data={gotoData:{url:'login'}};
                    Alert.myToastBottom({mess: "注销成功！", height:-160});
                    localStorageService.clearAll();
                    JumpUtil.goFun(data);
                });
            } else {
                //console.log('You are not sure');
            }
        });
    }

    //查看历史处置记录
    //$scope.checkHistory = function (){
    //    //$state.go("tab.dealHistoryList");
    //    var data={backData:{data:{backUrl:'tab.setting',level:1}},gotoData:{url:'dealHistoryList'}};
    //    JumpUtil.goFun(data);
    //}

}])
