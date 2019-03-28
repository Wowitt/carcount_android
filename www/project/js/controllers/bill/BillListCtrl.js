/*
create by woody
date 20170301
审批页面controller
*/
angular.module('myapp').controller('BillListCtrl',['$scope','$stateParams','Alert','Init','$ionicNavBarDelegate','JumpUtil','LoadUtil',function($scope,$stateParams,Alert,Init,$ionicNavBarDelegate,JumpUtil,LoadUtil) {
    $scope.billlist = new Array();
    var params = {};
    params.title = '提示';
    var TG_ID = "";
    $scope.ifExist = $stateParams.data.status;
    $scope.ifDisplay = $stateParams.data.ifDisplay;
    //刷新
    $scope.doRefresh = function() {
        //Stop the ion-refresher from spinning
        TG_ID = $stateParams.data.itemId;
        LoadUtil.showLoad('加载中');
        Init.iwbhttp('/transfer/queryBillList', {TG_ID: TG_ID, pn: 1, ps: 4}, function(data,header,config,status){
            if(data.resFlag == "0") {
                $scope.totalPage = parseInt(data.totalPage);
                $scope.pn = 1;
                $scope.billlist = data.billList;
                if($scope.billlist.length == 0){
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
                Alert.alertTemplate(params,function(res){
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

    //判断参数TG_ID是否不存在
    if($stateParams.data != undefined){
        TG_ID = $stateParams.data.itemId;
        //查询运单列表
        $scope.doRefresh();
    }else{
        return false;
    }

    //页刷新
    $scope.pageRefresh = function() {
        if ($scope.pn < $scope.totalPage) {
            $scope.pn = $scope.pn + 1;
            LoadUtil.showLoad('加载中');
            Init.iwbhttp('/transfer/queryBillList', {TG_ID: TG_ID,pn: $scope.pn, ps: 4}, function (data, header, config, status) {
                if (data.resFlag == "0") {
                    var bills_temp = data.billList;
                    angular.forEach(bills_temp, function (value, i) {
                        $scope.billlist.push(value);
                    });
                    if($scope.totalPage > $scope.pn){
                        $scope.flag = true;
                    }else{
                        $scope.flag = false;
                        Alert.myToastBottom({mess:"没有更多了！",height:-160});
                    }
                } else {
                    /*params.content = data.msg;
                    Alert.alertTemplate(params,function(res){
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
    //跳转到运单详情页
    $scope.goFunc = function(obj,params){
        var data={backData:{data:{backUrl: 'billlist',level: 2,status: $scope.ifExist,itemId: TG_ID,ifDisplay: $scope.ifDisplay}},gotoData:{}};
        data.gotoData.url = obj;
        data.gotoData.param = {data:params};
        JumpUtil.goFun(data);
    };
    //跳转到新增运单页
    $scope.addBill = function(obj){
        var data={backData:{data:{backUrl: 'billlist',level: 2,status: $scope.ifExist,itemId: TG_ID,ifDisplay: $scope.ifDisplay}},gotoData:{}};
        data.gotoData.url = obj;
        data.gotoData.param = {data:{TG_ID:$stateParams.data.itemId,method:'add'}};
        JumpUtil.goFun(data);
    };
    //返回
    $scope.myGoBack = function() {
        JumpUtil.goBackFun();
    };

}])
