/*
create by woody
date 20170301
账户页面controller
*/
angular.module('myapp').controller('DealAddCtrl',['$scope','Alert','$state','Init','localStorageService','$timeout','$ionicNavBarDelegate','JumpUtil','LoadUtil',function($scope,Alert,$state,Init,localStorageService,$timeout,$ionicNavBarDelegate,JumpUtil,LoadUtil) {

    if(localStorageService.get("ifLogin") == undefined || localStorageService.get("ifLogin") == null || localStorageService.get("ifLogin") == "" || localStorageService.get("ifLogin") != "0"){
        //console.log("setting====>"+localStorageService.get("ifLogin"));
        //$state.go("tab.login");
        var data={gotoData:{url:'login'}};
        JumpUtil.goFun(data);
        return;
    }

    var boxId = $("#boxId").offset().top;
    var btnId = $("#btnId").offset().top;
    var distances = btnId - boxId -58;
    var caseBlancheById = document.getElementById('caseBlanche');
    var top = (distances/2)-150;
    //$("#caseBlanche").css("top",(173+aaa)+"px");
    caseBlancheById.style.top = (boxId+top)+"px";
    $scope.username = localStorageService.get("nickName");
    $scope.epName = localStorageService.get("epName");
    $scope.codeList = new Array();
    //扫描标志
    $scope.scannerFlag = false;

    //扫描箱子数
    $scope.resultCount = 0;

    //处置废物
    $scope.deal = function (){
        if($scope.codeList.length == 0){
            /*Alert.alertTemplate({title:"提示",content:"请扫描箱子信息"},function(res){
                //console.log("====>"+res);
            })*/
            Alert.myToastBottom({mess: "请扫描箱子信息", height: -160});
            return;
        }
        var par = {dealInfo:{
            czPersonName: $scope.username,
            czPersonId:localStorageService.get("userId"),
            czEpId:localStorageService.get("epId"),
            czEpName:$scope.epName,
            boxIds:$scope.codeList
        }};
        LoadUtil.showLoad('');
        Init.iwbhttp("/deal/dealBox",par,function(data,header,config,status){
            if(data.resFlag == '0'){
                /*Alert.alertTemplate({title:"提示",content:data.msg},function(res){
                    //console.log("====>"+res);
                    if(res){
                        //$state.go("tab.dealList");
                        JumpUtil.goBackFun();
                        //alert(j+"==>"+$scope.cards[i]);
                    }
                })*/
                Alert.myToastBottom({mess: data.msg, height: -160});
                JumpUtil.goBackFun();
            }else{
                /*Alert.alertTemplate({title:"提示",content:data.msg},function(res){
                    //console.log("====>"+res);
                })*/
                Alert.myToastBottom({mess: data.msg, height: -160});
            }
            LoadUtil.hideLoad();
        },function(data,header,config,status){
            //Alert.myToastBottom({mess: "服务器未知异常", height: -160});
        });
    }

    //扫描箱子
    $scope.uhf = function(){
        $scope.scannerFlag = true;
        var div = document.getElementById('rond');
        div.className = 'roundAdd';
        Typed.new("#typed", {
            strings: ["扫描中..."],
            typeSpeed: 300,
            backDelay: 500,
            loop: true,
            showCursor: false,
            contentType: 'html', // or text
        });
        woody.plugins.PdaPlugin.uhf(function(data){
            if(data != "")
            {
                $scope.cards = JSON.parse(data);
                for(i in $scope.cards){
                    var index = $scope.codeList.length;
                    var flag = true;
                    for(var j=0;j<index;j++){
                        if( $scope.codeList[j].id == $scope.cards[i]){
                            flag = false;
                            break;
                        }
                    }
                    if(flag){
                        $scope.codeList[index] = new Object();
                        $scope.codeList[index].id = $scope.cards[i];
                    }
                }
            }
        },function(err){
            //alert(err);
        });
    }

    //扫描结束
    $scope.stopuhf = function(){
        woody.plugins.PdaPlugin.stopuhf(function(data){
            $timeout(function () {
                var div = document.getElementById('rond');
                div.className = div.className.replace('roundAdd','roundRemove');
                $scope.scannerFlag = false;
                $scope.resultCount = $scope.codeList.length;
            }, 500);
        },function(err){
            //alert(err);
        });
    }

    ////显示箱子编号
    //$scope.show = function(){
    //}

    //返回上一页
    $scope.myGoBack=function()
    {
        JumpUtil.goBackFun();
    }

}])
