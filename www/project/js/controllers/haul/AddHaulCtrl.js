/*
create by woody
date 20170301
审批页面controller
*/
angular.module('myapp').controller('AddHaulCtrl',['$scope','$state','Alert','$stateParams','$timeout','Init','localStorageService','$ionicNavBarDelegate','JumpUtil','LoadUtil',function($scope,$state,Alert,$stateParams,$timeout,Init,localStorageService,$ionicNavBarDelegate,JumpUtil,LoadUtil) {

    var TG_ID = "";
    $scope.haul = new Array();
    $scope.user = new Array();
    $scope.car = new Array();
    $scope.EN_NAME_CZ = localStorageService.get("epName");
    $scope.CZ_DRIVER_ID = localStorageService.get("userId");
    $scope.CZ_DRIVER_NAME = localStorageService.get("nickName");
    var data = {};
    var params = {};
    params.title = '提示';
    //判断行程信息是否正确，并提交
    $scope.confirm = function (){
        if($stateParams != undefined){
            TG_ID = $stateParams.itemId;
            /*if($scope.user.EN_NAME_CZ == undefined || $scope.user.EN_NAME_CZ == null || angular.equals($scope.user.EN_NAME_CZ, '')){
                params.content = '处置单位不能为空';
                Alert.alertTemplate(params);
                return false;
            }
            if($scope.user.CZ_DRIVER_NAME == undefined || $scope.user.CZ_DRIVER_NAME == null || angular.equals($scope.user.CZ_DRIVER_NAME, '')){
                params.content = '请先扫描司机身份卡';
                Alert.alertTemplate(params);
                return false;
            }*/
            if($scope.car.CI_ID == undefined || $scope.car.CI_ID == null || angular.equals($scope.car.CI_ID, '')){
                /*params.content = '请先扫描车辆身份卡';
                Alert.alertTemplate(params,function(res){
                });*/
                Alert.myToastBottom({mess: "请先扫描车辆身份卡", height: -160});
                return false;
            }
            if($scope.car.PLATE_NUMBER == undefined || $scope.car.PLATE_NUMBER == null || angular.equals($scope.car.PLATE_NUMBER, '')){
                /*params.content = '请先扫描车辆身份卡';
                Alert.alertTemplate(params,function(res){
                });*/
                Alert.myToastBottom({mess: "请先扫描车辆身份卡", height: -160});
                return false;
            }
            data = {
                TG_ID: TG_ID,
                EN_ID_CZ: localStorageService.get("epId"),
                EN_NAME_CZ: $scope.EN_NAME_CZ,
                CZ_DRIVER_ID: $scope.CZ_DRIVER_ID,
                CZ_DRIVER_NAME: $scope.CZ_DRIVER_NAME,
                CI_ID: $scope.car.CI_ID,
                PLATE_NUMBER: $scope.car.PLATE_NUMBER
            };
            LoadUtil.showLoad('');
            //保存行程信息
            Init.iwbhttp('/transfer/saveHaul', {haul : data}, function(data,header,config,status){
                //params.content = data.msg;
                if(data.resFlag == "0") {
                    //$scope.alert(params);
                    Alert.myToastBottom({mess: data.msg, height: -160});
                    JumpUtil.goBackFun();
                }else{
                    /*Alert.alertTemplate(params,function(res){
                    });*/
                    Alert.myToastBottom({mess: data.msg, height: -160});
                }
                LoadUtil.hideLoad();
            },function(data,header,config,status){
                //Alert.myToastBottom({mess: "服务器未知异常", height: -160});
            });
        }else{
            return false;
        }
    }

    //扫描
    $scope.scan = function (){
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if(!angular.equals("", result.text)){
                    var objInfo = encodeURIComponent(encodeURIComponent(result.text));
                    LoadUtil.showLoad('');
                    //根据车辆ID获取车辆的信息
                    Init.iwbhttp('/transfer/queryInfo', {param : objInfo, type: 1}, function(data,header,config,status){
                        if(data.resFlag == "0") {
                            if(data.car == undefined || data.car == null || data.car == ""){
                                /*params.content = '车辆与当前用户单位不一致';
                                Alert.alertTemplate(params,function(res){
                                });*/
                                Alert.myToastBottom({mess: "车辆与当前用户单位不一致", height: -160});
                                return false;
                            }else{
                                $scope.car = data.car;
                            }
                        }else{
                            /*params.content = data.msg;
                            Alert.alertTemplate(params,function(res){
                            });*/
                            Alert.myToastBottom({mess: data.msg, height: -160});
                        }
                        LoadUtil.hideLoad();
                    },function(data,header,config,status){
                        //Alert.myToastBottom({mess: "服务器未知异常", height: -160});
                    });
                }else{
                    /*Alert.alertTemplate({title:"提示",content:"未扫描到二维码，请重新扫描！"},function(res){
                    })*/
                    Alert.myToastBottom({mess: "未扫描到二维码，请重新扫描！", height: -160});
                }
                $timeout(function () {
                }, 500);
            },
            function (error) {
            },
            {
                preferFrontCamera : false, // iOS and Android
                showFlipCameraButton : true, // iOS and Android
                showTorchButton : true, // iOS and Android
                torchOn: false, // Android, launch with the torch switched on(if available)
                prompt : "请将二维码放在扫描框中", // Android
                resultDisplayDuration: 500, // Android, display scanned textfor X ms. 0 suppresses it entirely, default 1500
                formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                orientation : "portrait" // Android only (portrait|landscape),default unset so it rotates with the device
        });
    };

    //弹框
    $scope.alert = function (params){
        Alert.alertTemplate(params,function(res){
            if(res){
                JumpUtil.goBackFun();
            }
        })
    };

    //返回
    $scope.myGoBack = function() {
        JumpUtil.goBackFun();
    };

}])
