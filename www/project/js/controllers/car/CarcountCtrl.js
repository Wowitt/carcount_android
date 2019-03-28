/*
create by woody
date 20170301
账户页面controller
*/
angular.module('myapp').controller('CarcountCtrl',['$scope','Alert','$state','Init','localStorageService','$timeout','$ionicNavBarDelegate','JumpUtil','LoadUtil','$interval','Confirm','$ionicPopup','$stateParams',function($scope,Alert,$state,Init,localStorageService,$timeout,$ionicNavBarDelegate,JumpUtil,LoadUtil,$interval,Confirm,$ionicPopup,$stateParams) {
    $scope.url = cordova.file.applicationDirectory+"www/msg.mp3"
    $scope.waitFlag = false;
    $scope.funcOneFieldObj = {
        fieldObj:{}
    };
    $scope.funcTwoFieldObj = {
        fieldObj:{},
        parkObj:{}
    };
    $scope.carone = {}
    $scope.fieldList = [];
    $scope.carPlanName = $stateParams.data === null ? "如操作盘点功能请重新登录" : $stateParams.data.carPlanName;
    $scope.offlinedata = [];
//    var offlinedata = {
//                          "E2000016170701230580DB17":"津A100000",
//                          "E20020756405012515107A23":"津A200000",
//                          "E20020756405012923202744":"津A300000",
//                          "E2002075640501270450E13D":"津A400000",
//                          "E20020756405012813208F48":"津A500000",
//                          "E20020756405012814907A15":"津A600000",
//                          "E20020756405012815807156":"津A700000",
//                          "E2002075640501280630D43F":"津A800000",
//                          "E20020756405012818005AF0":"津A900000",
//                          "E20020756405012218705247":"津A100001",
//                          "E2002075640501220890B935":"津A110000",
//                          "E200207564050124220031C4":"津A120000",
//                          "E20020756405012819704675":"津A130000",
//                          "E2002075640501250350E8E7":"津A140000",
//                          "E2002075640501280120F418":"津A150000"
//                      }
    var boxId = $("#boxId").offset().top;
    var btnId = $("#btnId").offset().top;
    var distances = btnId - boxId -58;
    var caseBlancheById = document.getElementById('caseBlanche');
    var top = (distances/2)-150;
    //$("#caseBlanche").css("top",(173+aaa)+"px");
    caseBlancheById.style.top = (boxId+top)+"px";
    $scope.codeList = new Array();
    //扫描标志
    $scope.scannerFlag = false;
    $scope.ifcheckflag = false;
    $scope.ifshowdetail = false;
    //扫描箱子数
    $scope.resultCount = 0;

    $scope.reset = function(){
        $scope.resultCount = 0;
        $scope.codeList = new Array();
        $scope.showcar = [];
        $scope.carone = {};
    }
    $scope.playAudio = function(url) {
        // Play the audio file at url


        var my_media = new Media($scope.url,
            // success callback
            function () {
                console.log("playAudio():Audio Success");
            },
            // error callback
            function (err) {
                console.log("playAudio():Audio Error: "+err );
            }
        );
        // Play audio
        my_media.play();
    }
    $scope.init = function() {
        LoadUtil.showLoad('加载中');
        //Stop the ion-refresher from spinning
        Init.iwbhttp('/car/init',  {}, function(data,header,config,status){
            $scope.fieldList = data.fieldList
            LoadUtil.hideLoad();
        },function(data,header,config,status){
            LoadUtil.hideLoad();
            Alert.myToastBottom({mess: "服务器未知异常", height: -160});
        });
    };
    $scope.init();

    $scope.outField = function(){
        if($scope.carone == null || JSON.stringify($scope.carone) == "{}" || $scope.carone.id == null || $scope.carone.id == ""){
            Alert.myToastBottom({mess: "请扫描一辆车信息", height: -160});
            return false;
        }
        var tmp = {}
        tmp.content = '该车将出场' ;
        Confirm.confirmTemplate(tmp,function(res1){
            if(res1) {
                LoadUtil.showLoad('加载中');
                var param = {}
                param.carId = $scope.carone.carId
                param.plateNum = $scope.carone.plateNum
                param.fieldId = $scope.carone.fieldId
                param.fieldName = $scope.carone.fieldName
                Init.iwbhttp('/car/outField',  param, function(data,header,config,status){
                    if(data.resFlag == '0'){
                        Alert.myToastBottom({mess: data.msg, height: -160});
                    }else{
                        Alert.myToastBottom({mess: data.msg, height: -160});
                    }
                    LoadUtil.hideLoad();
                },function(data,header,config,status){
                    LoadUtil.hideLoad();
                    Alert.myToastBottom({mess: "服务器未知异常", height: -160});
                });
            } else {
            }
        });
    }

    $scope.inField = function(){
        if($scope.carone == null || JSON.stringify($scope.carone) == "{}" || $scope.carone.id == null || $scope.carone.id == ""){
            Alert.myToastBottom({mess: "请扫描一辆车信息", height: -160});
            return false;
        }
        var tmp = {}
        tmp.content = '该车将回场' ;
        Confirm.confirmTemplate(tmp,function(res1){
            if(res1) {
                LoadUtil.showLoad('加载中');
                var param = {}
                param.carId = $scope.carone.carId
                param.plateNum = $scope.carone.plateNum
                param.fieldId = $scope.carone.fieldId
                param.fieldName = $scope.carone.fieldName
                Init.iwbhttp('/car/inField',  param, function(data,header,config,status){
                    if(data.resFlag == '0'){
                        Alert.myToastBottom({mess: data.msg, height: -160});
                    }else{
                        Alert.myToastBottom({mess: data.msg, height: -160});
                    }
                    LoadUtil.hideLoad();
                },function(data,header,config,status){
                    LoadUtil.hideLoad();
                    Alert.myToastBottom({mess: "服务器未知异常", height: -160});
                });
            } else {
            }
        });
    }

    $scope.changeField = function(){
        if($scope.carone == null || JSON.stringify($scope.carone) == "{}" || $scope.carone.id == null || $scope.carone.id == ""){
            Alert.myToastBottom({mess: "请扫描一辆车信息", height: -160});
            return false;
        }
        if( $scope.funcOneFieldObj.fieldObj === null || $scope.funcOneFieldObj.fieldObj.ID == undefined ){
            Alert.myToastBottom({mess: "请选场地", height: -160});
            return false;
        }
        var tmp = {}
        tmp.content = '该车将移动到'+$scope.funcOneFieldObj.fieldObj.NAME ;
        Confirm.confirmTemplate(tmp,function(res1){
            if(res1) {
                LoadUtil.showLoad('加载中');
                var param = {}
                param.carId = $scope.carone.carId
                param.plateNum = $scope.carone.plateNum
                param.fieldId = $scope.funcOneFieldObj.fieldObj.ID
                param.fieldName = $scope.funcOneFieldObj.fieldObj.NAME
                Init.iwbhttp('/car/changeField',  param, function(data,header,config,status){
                    if(data.resFlag == '0'){
                        Alert.myToastBottom({mess: data.msg, height: -160});
                    }else{
                        Alert.myToastBottom({mess: data.msg, height: -160});
                    }
                    LoadUtil.hideLoad();
                },function(data,header,config,status){
                    LoadUtil.hideLoad();
                    Alert.myToastBottom({mess: "服务器未知异常", height: -160});
                });
            } else {
            }
        });

    }

    $scope.updatePark = function(){
        if($scope.carone == null || JSON.stringify($scope.carone) == "{}" || $scope.carone.id == null || $scope.carone.id == ""){
            Alert.myToastBottom({mess: "请扫描一辆车信息", height: -160});
            return false;
        }
        if($scope.funcTwoFieldObj.fieldObj === null || $scope.funcTwoFieldObj.fieldObj.ID == undefined ){
            Alert.myToastBottom({mess: "请选场地", height: -160});
            return false;
        }
        if($scope.funcTwoFieldObj.parkObj === null || $scope.funcTwoFieldObj.parkObj.NO == undefined ){
            Alert.myToastBottom({mess: "请选位置", height: -160});
            return false;
        }
        var tmp = {}
        tmp.content = '该车将移动到'+$scope.funcTwoFieldObj.fieldObj.NAME +"的"+$scope.funcTwoFieldObj.parkObj.NO+"位置";
        Confirm.confirmTemplate(tmp,function(res1){
            if(res1) {
                var param = {}
                param.carId = $scope.carone.carId
                param.plateNum = $scope.carone.plateNum
                param.fieldId = $scope.funcTwoFieldObj.fieldObj.ID
                param.fieldName = $scope.funcTwoFieldObj.fieldObj.NAME
                param.parkNo = $scope.funcTwoFieldObj.parkObj.NO
                if($scope.funcTwoFieldObj.parkObj.CAR_ID != null && $scope.funcTwoFieldObj.parkObj.CAR_ID != "" )
                {
                    var data = {}
                    data.content = '该车位已有车辆,操作是否继续?';
                    Confirm.confirmTemplate(data,function(res){
                        if(res) {
                            param.ifLog = 1;
                            param.oldplateNum = $scope.funcTwoFieldObj.parkObj.CAR_ID;
                            Init.iwbhttp('/car/updatePark',  param, function(data,header,config,status){
                                if(data.resFlag == '0'){
                                    Alert.myToastBottom({mess: data.msg, height: -160});
                                }else{
                                    Alert.myToastBottom({mess: data.msg, height: -160});
                                }
                                LoadUtil.hideLoad();
                                $scope.init();
                            },function(data,header,config,status){
                                LoadUtil.hideLoad();
                                Alert.myToastBottom({mess: "服务器未知异常", height: -160});
                            });
                        } else {
                        }
                    });
                    return false;
                }
                LoadUtil.showLoad('加载中');
                Init.iwbhttp('/car/updatePark',  param, function(data,header,config,status){
                    if(data.resFlag == '0'){
                        Alert.myToastBottom({mess: data.msg, height: -160});
                    }else{
                        Alert.myToastBottom({mess: data.msg, height: -160});
                    }
                    LoadUtil.hideLoad();
                    $scope.init();
                },function(data,header,config,status){
                    LoadUtil.hideLoad();
                    Alert.myToastBottom({mess: "服务器未知异常", height: -160});
                });
            } else {
            }
        });

    }

    //处置废物
    $scope.deal = function (cardno,index){
        var par = {};
        par.cardno = cardno
        if($scope.carPlanName == '无' || $scope.carPlanName == '如操作盘点功能请重新登录'){
            par.carPlanName = ""
        }else{
            par.carPlanName = $scope.carPlanName;
        }
        LoadUtil.showLoad('请稍等');
        Init.iwbhttp("/car/querybyCardno",par,function(data,header,config,status){
            if(data.resFlag == '0'){
                $scope.codeList[index] = new Object();
                $scope.codeList[index].id = cardno;
                $scope.codeList[index].carId = data.car.ID;
                $scope.codeList[index].plateNum = data.car.PLATE_NUM;
                $scope.codeList[index].engineNum = data.car.ENGINE_NUMBER;
                $scope.codeList[index].frameNum = data.car.FRAME_NUMBER;
                $scope.codeList[index].fieldId = data.car.FIELD_ID;
                $scope.codeList[index].fieldName = data.car.FIELD_NAME;
                $scope.waitFlag = false;
//                var tmp = {}
//                tmp.carId = data.car.ID;
//                tmp.plateNum = data.car.PLATE_NUM;
//                tmp.engineNum = data.car.ENGINE_NUMBER;
//                tmp.frameNum = data.car.FRAME_NUMBER;
//                tmp.cardno = data.car.cardno;
//                $scope.offlinedata.push(tmp)
            }else{
                Alert.myToastBottom({mess: data.msg, height: -160});
            }
            LoadUtil.hideLoad();
        },function(data,header,config,status){
            Alert.myToastBottom({mess: "服务器未知异常", height: -160});
            LoadUtil.hideLoad();
        });
    }

    //处置废物
    $scope.dealone = function (cardno){
        var par = {};
        par.cardno = cardno
        LoadUtil.showLoad('请稍等');
        Init.iwbhttp("/car/querybyCardno",par,function(data,header,config,status){
            if(data.resFlag == '0'){
                $scope.carone = new Object();
                $scope.carone.id = cardno;
                $scope.carone.carId = data.car.ID;
                $scope.carone.plateNum = data.car.PLATE_NUM;
                $scope.carone.engineNum = data.car.ENGINE_NUMBER;
                $scope.carone.frameNum = data.car.FRAME_NUMBER;
                $scope.carone.fieldId = data.car.FIELD_ID;
                $scope.carone.fieldName = data.car.FIELD_NAME;

            }else{
                Alert.myToastBottom({mess: data.msg, height: -160});
            }
            LoadUtil.hideLoad();
        },function(data,header,config,status){
            Alert.myToastBottom({mess: "服务器未知异常", height: -160});
            LoadUtil.hideLoad();
        });
    }


//    $scope.mypromise;
//    $scope.startRead = function(){
//        $scope.mypromise = $interval(function(){
//            woody.plugins.PdaPlugin.uhf(function(data){
//                if(data != "")
//                {
//                    $timeout(function(){
//                        $scope.ifcheckflag = false;
//                    },500)
//                    var div = document.getElementById('rond');
//                    $scope.cards = JSON.parse(data);
//                    for(i in $scope.cards){
//                        var index = $scope.codeList.length;
//                        var flag = true;
//                        for(var j=0;j<index;j++){
//                            if( $scope.codeList[j].id == $scope.cards[i]){
//                                $scope.ifcheckflag = true;
//                                flag = false;
//                                break;
//                            }
//                        }
//                        if(flag){
//                            $scope.codeList[index] = new Object();
//                            var carid = $scope.cards[i]
//                            if(offlinedata[carid].indexOf('津') == 0 ){
//                                $scope.ifcheckflag = true;
//
//                                $scope.codeList[index].id = carid;
//                                $scope.showcar.unshift(offlinedata[carid])
//                                $scope.playAudio()
//                            }
//
//                        }
//                    }
//                }
//            },function(err){
//                //alert(err);
//            });
//            $timeout(function () {
//                $scope.stopRead()
//            },2000)
//        },3500)
//    }

//    $scope.stopRead = function(){
//        woody.plugins.PdaPlugin.stopuhf(function(data){
//            $timeout(function () {
//                $scope.resultCount = $scope.codeList.length;
//            }, 500);
//        },function(err){
//            //alert(err);
//        });
//    }

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
                $timeout(function(){
                    $scope.ifcheckflag = false;
                },500)
                $scope.cards = JSON.parse(data);
                for(i in $scope.cards){
                    var index = $scope.codeList.length;
                    var flag = true;
                    for(var j=0;j<index;j++){
                        if( $scope.codeList[j].id == $scope.cards[i]){
                            flag = false;
                            $scope.ifcheckflag = true;
                            break;
                        }
                    }
                    if(flag && !$scope.waitFlag){
                        $scope.codeList[index] = new Object();
                        $scope.codeList[index].id = $scope.cards[i];

                        $scope.waitFlag = true;
                        $scope.deal($scope.cards[i],index)
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

    //扫描箱子
    $scope.uhfone = function(){
        woody.plugins.PdaPlugin.uhf(function(data){
            if(data != "" && data != "{}")
            {
                $scope.cards = JSON.parse(data);
                var cardno = $scope.cards[Object.keys($scope.cards).sort().pop()]
                $scope.dealone(cardno)
            }
        },function(err){
            //alert(err);
        });
    }

    //扫描结束
    $scope.stopuhfone = function(){
        woody.plugins.PdaPlugin.stopuhf(function(data){
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

    $scope.scanBtn = function(){
        if(!$scope.scannerFlag){
            $scope.uhf()
        }else{
            $scope.stopuhf()
        }
    }

    $scope.showdetal = function(){
        $scope.ifshowdetail = !$scope.ifshowdetail
    }
    $scope.logout = function(){
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
                        Alert.myToastBottom({mess: "退出成功", height: -160});
                        $state.go("accountLogin");
                    }else{
                        /*Alert.alertTemplate({title:"提示",content:data.msg},function(res){
                        });*/
                        Alert.myToastBottom({mess: data.msg, height: -160});
                    }
                    LoadUtil.hideLoad();
                },function(data,header,config,status){
                    var data={gotoData:{url:'login'}};
                    Alert.myToastBottom({mess: "退出成功！", height:-160});
                    localStorageService.clearAll();
                    $state.go("accountLogin");
                });
            } else {
                //console.log('You are not sure');
            }
        });
    }
}])
