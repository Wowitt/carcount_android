/*
create by woody
date 20170301
审批页面controller
*/
angular.module('myapp').controller('HaulListCtrl',['$scope','Init','Alert','localStorageService','$ionicPopup','JumpUtil','LoadUtil','Confirm','$ionicScrollDelegate',function($scope,Init,Alert,localStorageService,$ionicPopup,JumpUtil,LoadUtil,Confirm,$ionicScrollDelegate) {

    var params = {};
    params.title = '提示';

    $scope.haul = "";

    //刷新
  	$scope.doRefresh = function() {
        LoadUtil.showLoad('加载中');
        //Stop the ion-refresher from spinning
        Init.iwbhttp('/transfer/queryHaul',  {epId: localStorageService.get("epId"), userId: localStorageService.get("userId")}, function(data,header,config,status){
            if(data.resFlag == "0") {
                $scope.haul = data.haul;
            }else{
                /*params.content = data.msg;
                Alert.alertTemplate(params, function(){
                });*/
                Alert.myToastBottom({mess: data.msg, height: -160});
            }
            LoadUtil.hideLoad();
        },function(data,header,config,status){
            //LoadUtil.hideLoad();
            //Alert.myToastBottom({mess: "服务器未知异常", height: -160});
        });
        $scope.$broadcast('scroll.refreshComplete');
    };
    //查询行程列表
    $scope.doRefresh();

    //跳转到行程详情页--运单列表页
    $scope.goFunc = function(obj,param){
        if(angular.equals(param.personId, localStorageService.get("userId"))){
            var data={backData:{data:{backUrl:'tab.haullist',level:1}},gotoData:{}};
            data.gotoData.url = obj;
            param.ifDisplay = true;
            data.gotoData.param = {data: param};
            JumpUtil.goFun(data);
        }else{
            Alert.myToastBottom({mess: "该行程不是您创建的，请登录" + param.personName + "进行操作", height: -160});
            return false;
        }
    };

    $scope.data = {};
    //跳转到新增行程页
    $scope.addHaul = function(obj){
        var data={backData:{data:{backUrl:'tab.haullist',level:1}},gotoData:{}};
        data.gotoData.url = obj;
        JumpUtil.goFun(data);
    };

    //删除没有运单的行程
    $scope.delete = function(haul){
        if(angular.equals(haul.CZ_DRIVER_ID, localStorageService.get("userId"))){
            LoadUtil.showLoad('加载中');
            Init.iwbhttp('/transfer/deleteHaul', {TG_ID: haul.TG_ID}, function (data, header, config, status) {
                params.content = data.msg;
                /*Alert.alertTemplate(params, function () {
                    if(data.resFlag == "0"){
                        $scope.haullist.splice($scope.haullist.indexOf(haul), 1);
                    }
                });*/
                Alert.myToastBottom({mess: data.msg, height: -160});
                if(data.resFlag == "0"){
                    $scope.haullist.splice($scope.haullist.indexOf(haul), 1);
                }
                LoadUtil.hideLoad();
            }, function (data, header, config, status) {
                //Alert.myToastBottom({mess: "服务器未知异常", height: -160});
            });
        }else{
            Alert.myToastBottom({mess: "该行程不是您创建的，请登录" + haul.CZ_DRIVER_NAME + "进行操作", height: -160});
            return false;
        }
    };

    //跳转到行程废物总量页
    $scope.fillWeight = function(haul){
        if(angular.equals(haul.CZ_DRIVER_ID, localStorageService.get("userId"))){
            $scope.haul = haul;
            $scope.showPopup($scope.haul.TARE, $scope.haul.weight);
        }else{
            Alert.myToastBottom({mess: "该行程不是您创建的，请登录" + haul.CZ_DRIVER_NAME + "进行操作", height: -160});
            return false;
        }
    };

    //弹出自定义输入重量框
    $scope.showPopup = function(TARE, weight) {
        // 自定义弹窗
        var myPopup = $ionicPopup.show({
            template: '<div><span style="font-size: 16px; line-height: 35px; text-align: center;">废物重量(公斤)</span><input type="number" style="width: 50%; font-size: 16px; float: right;" placeholder="请输入废物重量" ng-model="data.weight"></div>',
            title: '填写废物重量',
            scope: $scope,
            buttons: [
                {text: '取消'},
                {
                    text: '确定',
                    type: 'button-positive btn-p',
                    onTap: function(e) {
                        if ($scope.data.weight == undefined || $scope.data.weight == null || angular.equals("", $scope.data.weight)) {
                            // 不允许用户关闭，除非输入 wifi 密码
                            //e.preventDefault();
                            Alert.myToastBottom({mess: "输入的总量不能为空", height: -160});
                        } else {
                            if($scope.data.weight.length > 7){
                                Alert.myToastBottom({mess: "输入的行程废物重量不能超过7位数", height: -160});
                            }else{
                                if (parseFloat($scope.data.weight) <= 0) {
                                    Alert.myToastBottom({mess: "输入的行程废物重量不能小于等于0", height: -160});
                                }else{
                                    if((parseFloat(weight) + parseFloat(TARE)) < $scope.data.weight){
                                        return $scope.data.weight;
                                    }else{
                                        Alert.myToastBottom({mess: "输入的总量有误，请重新填写", height: -160});
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            if(res != undefined && res != null && !angular.equals("", res))
            {
                var data = {content: "如果点击确认按钮，该行程结束其内容将无法更改，是否继续？", res: res};
                Confirm.confirmTemplate(data, function(res){
                    //请求后台，保存重量
                    if(res == true){
                        $scope.confirm(data.res);
                    }
                });
            }
            $scope.data.weight = "";
        });
    };

    $scope.confirm = function (res){
        LoadUtil.showLoad('');
        Init.iwbhttp('/transfer/saveWeight', {haul: $scope.haul, weight: res}, function (data, header, config, status) {
            /*params.content = data.msg;
            Alert.alertTemplate(params, function(){
                if(data.resFlag == "0"){
                    $scope.haul = "";
                    /!*$scope.haul.TOTAL_WEIGHT = data.TOTAL_WEIGHT;
                    $scope.haul.WEIGHT = data.WEIGHT;
                    $scope.haul.STATUS = "4";
                    $scope.haul.STATUSNAME = "运输完成";*!/
                }
            });*/
            Alert.myToastBottom({mess: data.msg, height: -160});
            if(data.resFlag == "0"){
                $scope.haul = "";
            }
            LoadUtil.hideLoad();
            $ionicScrollDelegate.scrollTop();
        }, function (data, header, config, status) {
            //Alert.myToastBottom({mess: "服务器未知异常", height: -160});
        });
    };

}]);
