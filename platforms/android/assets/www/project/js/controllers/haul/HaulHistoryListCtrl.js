/*
create by woody
date 20170301
审批页面controller
*/
angular.module('myapp').controller('HaulHistoryListCtrl',['$scope','Init','Alert','localStorageService','$ionicPopup','JumpUtil','LoadUtil',function($scope,Init,Alert,localStorageService,$ionicPopup,JumpUtil,LoadUtil) {

    var params = {};
    params.title = '提示';

    $scope.haullist = new Array();

    //刷新
  	$scope.doRefresh = function() {
        LoadUtil.showLoad('加载中');
        //Stop the ion-refresher from spinning
        Init.iwbhttp('/transfer/queryHaulListForUser',  {epId: localStorageService.get("epId"), userId: localStorageService.get("userId"), pn: 1, ps: 4}, function(data,header,config,status){
            if(data.resFlag == "0") {
                $scope.totalPage = parseInt(data.totalPage);
                $scope.pn = 1;
                $scope.haullist = data.haulList;
                if($scope.haullist.length == 0){
                    Alert.myToastBottom({mess: "未查询到结果", height: -160});
                }else{
                    Alert.myToastBottom({mess: "共查询了" + data.totalRow+ "条数据", height: -160});
                }
                if($scope.totalPage > 1){
                    $scope.flag = true;
                }else{
                    $scope.flag = false;
                }
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

    //分页刷新
    $scope.pageRefresh = function(){
        // pagenum = pagenum + 1;
        if($scope.pn < $scope.totalPage) {
            $scope.pn = $scope.pn + 1;
            LoadUtil.showLoad('加载中');
            Init.iwbhttp('/transfer/queryHaulList', {epId: localStorageService.get("epId"), userId: localStorageService.get("userId"), pn: $scope.pn, ps: 4}, function (data, header, config, status) {
                if (data.resFlag == "0") {
                    var hauls_temp = data.haulList;
                    angular.forEach(hauls_temp,function(value,i){
                        $scope.haullist.push(value);
                    });
                    if($scope.totalPage > $scope.pn){
                        $scope.flag = true;
                    }else{
                        $scope.flag = false;
                        Alert.myToastBottom({mess:"没有更多了！",height:-160});
                    }
                } else {
                    /*params.content = data.msg;
                    Alert.alertTemplate(params, function(){
                    });*/
                    Alert.myToastBottom({mess: data.msg, height: -160});
                }
                LoadUtil.hideLoad();
            }, function (data, header, config, status) {
                //LoadUtil.hideLoad();
                //Alert.myToastBottom({mess: "服务器未知异常", height: -160});
            });
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    //跳转到行程详情页--运单列表页
    $scope.goFunc = function(obj,param){
        if(angular.equals(param.personId, localStorageService.get("userId"))){
            var data={backData:{data:{backUrl:'tab.haulhistorylist',level:1}},gotoData:{}};
            data.gotoData.url = obj;
            param.ifDisplay = false;
            data.gotoData.param = {data: param};
            JumpUtil.goFun(data);
        }else{
            Alert.myToastBottom({mess: "该行程不是您创建的，请登录" + param.personName + "进行操作", height: -160});
            return false;
        }
    };

}]);
