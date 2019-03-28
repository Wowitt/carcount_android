/*
 create by woody
 date 20170301
 审批页面controller
 */
angular.module('myapp').controller('AddBillCtrl',['$rootScope','$scope','$state','$stateParams','Alert','Init','$timeout','$ionicNavBarDelegate','JumpUtil','LoadUtil','$ionicPopup','Confirm',function($rootScope,$scope,$state,$stateParams,Alert,Init,$timeout,$ionicNavBarDelegate,JumpUtil,LoadUtil,$ionicPopup,Confirm) {
    $scope.length = 0;
    var param = {};
    var params = {};
    params.title = '提示';
    $scope.bill = new Array();
    $scope.user = new Array();
    $scope.boxList = new Array();
    $scope.data = new Array();
    $scope.weight = 0;
    $scope.unit = "个";
    $scope.result = 0;
    $scope.visible = true;
    //动画居中
    var boxId = $("#content_id").offset().top;
    var btnId = $("#btn_id").offset().top;
    var distances = btnId - boxId -58;
    var caseBlancheById = document.getElementById('caseBlanche');
    var top = (distances/2)-150;
    caseBlancheById.style.top = (boxId+top)+"px";

    if($stateParams.data.method == "add"){
        $rootScope.const.tab5.header_title = "新增运单";
        $scope.visible = true;
        $scope.bill = {};
    }else{
        LoadUtil.showLoad('加载中');
        $rootScope.const.tab5.header_title = "运单详情";
        $scope.visible = false;
        if($stateParams.data.itemId == undefined || $stateParams.data.itemId == null || angular.equals($stateParams.data.itemId, '')){
            return false;
        }else{
            //查询运单信息
            Init.iwbhttp('/transfer/queryBill', {TB_ID: $stateParams.data.itemId}, function(data,header,config,status){
                if(data.resFlag == "0") {
                    $scope.bill = data.bill;
                    $scope.boxList = $scope.bill.boxList;
                    if($scope.boxList.length >= 0 && $scope.bill.weight <= 0){
                        $scope.result = $scope.boxList.length;
                        $scope.unit = "个";
                    }else{
                        $scope.result = $scope.bill.weight;
                        $scope.unit = "公斤";
                    }
                    $scope.user = {
                        PI_ID:$scope.bill.CS_PERSON_ID,
                        NAME:$scope.bill.CS_PERSON_NAME,
                        EP_ID:$scope.bill.EN_ID_CS,
                        EP_NAME:$scope.bill.EN_NAME_CS
                    };
                    $scope.setWeightCss();
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
        }
    }

    $scope.confirm = function (){
        //保存运单信息
        if($scope.user.NAME == undefined || $scope.user.NAME == null || angular.equals($scope.user.NAME, "")){
            /*params.content = '请先扫描医疗人员卡';
             Alert.alertTemplate(params,function(res){
             });*/
            Alert.myToastBottom({mess: "请先扫描医疗人员卡", height: -160});
            return;
        }
        if($scope.result <= 0){
            /*params.content = '请扫描箱子或填写重量';
             Alert.alertTemplate(params,function(res){
             });*/
            Alert.myToastBottom({mess: "请扫描箱子或填写重量", height: -160});
            return;
        }
        param = {
            TG_ID:$stateParams.data.TG_ID,
            EN_ID_CS: $scope.user.EP_ID,
            EN_NAME_CS: $scope.user.EP_NAME,
            CS_PERSON_ID: $scope.user.PI_ID,
            CS_PERSON_NAME: $scope.user.NAME,
            COUNT: $scope.boxList.length,
            WEIGHT: $scope.weight,
            boxList: $scope.boxList
        };
        LoadUtil.showLoad('');
        Init.iwbhttp('/transfer/saveBill', {bill : param}, function(data,header,config,status){
            //params.content = data.msg;
            if(data.resFlag == "0") {
                //$scope.alert(params);
                Alert.myToastBottom({mess: data.msg, height: -160});
                JumpUtil.goBackFun();
            }else if(data.resFlag == "1"){
                /*Alert.alertTemplate(params,function(res){
                 });*/
                Alert.myToastBottom({mess: data.msg, height: -160});
            }else{
                data.content = data.msg;
                var result = Confirm.confirmTemplate(data,function(res){
                    if(res) {
                        Init.iwbhttp("/transfer/updateBill",{bill : param, str: data.str},function(data,header,config,status){
                            //params.content = data.msg;
                            if(data.resFlag == "0"){
                                //$scope.alert(params);
                                Alert.myToastBottom({mess: data.msg, height: -160});
                                JumpUtil.goBackFun();
                            }else{
                                /*Alert.alertTemplate(params,function(res){
                                 });*/
                                Alert.myToastBottom({mess: data.msg, height: -160});
                            }
                        },function(data,header,config,status){
                            //Alert.myToastBottom({mess: "服务器未知异常", height: -160});
                        });
                    } else {
                    }
                });
            }
            LoadUtil.hideLoad();
        },function(data,header,config,status){
            //Alert.myToastBottom({mess: "服务器未知异常", height: -160});
        });
    };
    //扫描人员信息
    $scope.scanPersonCode = function (){
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if(!angular.equals("", result.text)){
                    var objInfo = encodeURIComponent(encodeURIComponent(result.text));
                    LoadUtil.showLoad('');
                    //根据交接员ID获取交接员的信息
                    Init.iwbhttp('/transfer/queryInfo', {param : objInfo, type: 0}, function(data,header,config,status){
                        if(data.resFlag == "0") {
                            $scope.user = data.user;
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
                    /*params.content = "未扫描到二维码，请重新扫描！";
                     Alert.alertTemplate(params,function(res){
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
    //开始扫描箱子芯片卡
    $scope.startuhf = function(){
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
                    var index = $scope.boxList.length;
                    var flag = true;
                    for(var j=0;j<index;j++){
                        if( $scope.boxList[j].BOX_ID == $scope.cards[i]){
                            flag = false;
                            break;
                        }
                    }
                    if(flag){
                        $scope.boxList[index] = new Object();
                        $scope.boxList[index].BOX_ID = $scope.cards[i];
                        $scope.bill.COUNT = index + 1;
                        console.log("count====>" + $scope.bill.COUNT);
                    }
                }
            }
        },function(err){
            //alert(err);
        });
    };
    //扫描结束
    $scope.stopuhf = function(){
        woody.plugins.PdaPlugin.stopuhf(function(data){
            $timeout(function () {
                var div = document.getElementById('rond');
                div.className = div.className.replace('roundAdd','roundRemove');
                $scope.scannerFlag = false;
                $scope.bill.COUNT = $scope.boxList.length;
                $scope.result = $scope.bill.COUNT;
                $scope.unit = "个";
                $(".waitButton").attr("disabled", true);
                $scope.setWeightCss();
            }, 500);
        },function(err){
            //alert(err);
        });
    }

    //跳转到行程废物总量页
    $scope.saveWeight = function(){
        $scope.showPopup();
    };

    //弹出自定义输入重量框
    $scope.showPopup = function() {
        // 自定义弹窗
        var myPopup = $ionicPopup.show({
            template: '<div><span style="font-size: 16px; line-height: 35px; text-align: center;">废物重量(公斤)</span><input type="number" style="width: 50%; font-size: 16px; float: right;" placeholder="请输入废物重量" ng-model="data.weight"></div>',
            title: '填写该运单废物重量',
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
                            Alert.myToastBottom({mess: "输入的运单废物重量不能为空", height: -160});
                        }else{
                            if(($scope.data.weight+"").length > 7){
                                Alert.myToastBottom({mess: "输入的运单废物重量不能超过7位数", height: -160});
                            }else{
                                var patrn = /^[0-9]+(.[0-9]{1,3})?$/;
                                if(!patrn.exec($scope.data.weight)){
                                    Alert.myToastBottom({mess: "输入的运单废物重量只能保存小数点后三位的数", height: -160});
                                }else{
                                    if (parseFloat($scope.data.weight) < 0.001) {
                                        Alert.myToastBottom({mess: "输入的运单废物重量不能小于0.001", height: -160});
                                    }else{
                                        $scope.weight = $scope.data.weight;
                                        $scope.result = $scope.weight;
                                        $scope.unit = "公斤";
                                        $(".confirmButton").attr("disabled", true);
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            $scope.setWeightCss();
            $scope.data.weight = "";
        });
    };

    //弹框
    $scope.alert = function (params){
        //console.log("confirm");
        Alert.alertTemplate(params,function(res){
            //console.log("====>"+res);
            if(res){
                //$state.go("billlist",{data:{itemId:$stateParams.data.TG_ID}});
                JumpUtil.goBackFun();
            }
        })
    };

    //显示箱子编号
    $scope.show = function(){
    }

    //返回
    $scope.myGoBack = function() {
        JumpUtil.goBackFun();
    };

    //重量显示样式
    $scope.setWeightCss = function() {
        var length = ($scope.result+"").length;
        switch(length){
            case 3:
                document.getElementById("resultCount").style.fontSize = "50px";
                document.getElementById("resultCount").style.paddingTop = "70px";
                document.getElementById("resultCount").style.paddingLeft = "45px";
                document.getElementById("resultCount").style.width = "140px";
                document.getElementById("resultUnit").style.paddingTop= "78px";
                break;
            case 4:
                document.getElementById("resultCount").style.fontSize = "50px";
                document.getElementById("resultCount").style.paddingLeft = "15px";
                document.getElementById("resultCount").style.width = "160px";
                document.getElementById("resultUnit").style.paddingTop= "80px";
                break;
            case 5:
                document.getElementById("resultCount").style.fontSize = "50px";
                document.getElementById("resultCount").style.paddingLeft = "19px";
                document.getElementById("resultCount").style.width = "160px";
                document.getElementById("resultUnit").style.paddingTop= "80px";
                break;
            case 6:
                document.getElementById("resultCount").style.fontSize = "40px";
                document.getElementById("resultCount").style.paddingLeft = "16px";
                document.getElementById("resultCount").style.width = "170px";
                document.getElementById("resultUnit").style.paddingTop= "76px";
                break;
            case 7:
                document.getElementById("resultCount").style.fontSize = "40px";
                document.getElementById("resultCount").style.paddingLeft = "12px";
                document.getElementById("resultCount").style.width = "180px";
                document.getElementById("resultUnit").style.paddingTop= "76px";
                break;
            default :
                document.getElementById("resultCount").style.fontSize = "60px";
                document.getElementById("resultCount").style.paddingTop = "70px";
                document.getElementById("resultCount").style.paddingLeft = "45px";
                document.getElementById("resultCount").style.width = "140px";
                document.getElementById("resultUnit").style.paddingTop= "86px";
        }
    };

}])
