/*
create by woody
date 20170301
审批页面controller
*/
angular.module('myapp').controller('DealHistoryListCtrl',['$scope','Init','localStorageService','$ionicNavBarDelegate','Alert','JumpUtil','LoadUtil',function($scope,Init,localStorageService,$ionicNavBarDelegate, Alert,JumpUtil,LoadUtil) {
    if(localStorageService.get("ifLogin") == undefined || localStorageService.get("ifLogin") == null || localStorageService.get("ifLogin") == "" || localStorageService.get("ifLogin") != "0"){
        //console.log("setting====>"+localStorageService.get("ifLogin"));
        var data={gotoData:{url:'login'}};
        JumpUtil.goFun(data);
        return;
    }

    $scope.deallist = new Array();

    //下拉刷新
  	$scope.doRefresh = function() {
        LoadUtil.showLoad('加载中');
        //Stop the ion-refresher from spinning
		Init.iwbhttp("/deal/queryDealListHistory",{epId: localStorageService.get("epId"), pn: 1, ps: 12},function(data,header,config,status){
            if(data.resFlag == 0){
                $scope.totalPage = parseInt(data.totalPage);
                $scope.pn = 1;
                $scope.deallist = data.dealList;
                if($scope.totalPage > 1){
                    $scope.flag = true;
                }else{
                    $scope.flag = false;
                }
                if($scope.deallist.length == 0){
                    Alert.myToastBottom({mess: "未查询到结果", height: -160});
                }else{
                    Alert.myToastBottom({mess: "共查询了" + data.totalRow+ "条数据", height: -160});
                }
            }else{
                /*Alert.alertTemplate({title:"提示",content:data.msg},function(res){
                })*/
                Alert.myToastBottom({mess: data.msg, height: -160});
            }
            LoadUtil.hideLoad();
        },function(data,header,config,status){
            //LoadUtil.hideLoad();
            //Alert.myToastBottom({mess: "服务器未知异常", height: -160});
        });
        $scope.$broadcast('scroll.refreshComplete');
    };

    //请求历史处置数据
    $scope.doRefresh();

    //上拉加载
    $scope.pageRefresh = function(){
        if($scope.pn < $scope.totalPage) {
            $scope.pn = $scope.pn + 1;
            LoadUtil.showLoad('加载中');
            Init.iwbhttp('/deal/queryDealListHistory', {epId: localStorageService.get("epId"), pn: $scope.pn, ps: 12}, function (data, header, config, status) {
                if(data.resFlag == 0){
                    var deals_temp = data.dealList;
                    //console.log(JSON.stringify(data.haulList));
                    angular.forEach(deals_temp,function(value,i){
                        $scope.deallist.push(value);
                    });
                    if($scope.totalPage > $scope.pn){
                        $scope.flag = true;
                    }else{
                        $scope.flag = false;
                        Alert.myToastBottom({mess:"没有更多了！",height:-160});
                    }
                }else{
                    /*Alert.alertTemplate({title:"提示",content:data.msg},function(res){
                    })*/
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

    //返回上一页
    //$scope.myGoBack=function()
    //{
    //    JumpUtil.goBackFun();
    //}
}])
