/*
 create by woody
 date 20170301
 账户页面controller
 */
angular.module('myapp').controller('LoginCtrl', ['$scope', '$rootScope', '$ionicLoading', 'localStorageService', 'Init', 'Alert', 'JumpUtil', 'LoadUtil', '$ionicPopup', function ($scope, $rootScope, $ionicLoading, localStorageService, Init, Alert, JumpUtil, LoadUtil, $ionicPopup) {
    if (localStorageService.get("ifLogin") != undefined && localStorageService.get("ifLogin") != null && localStorageService.get("ifLogin") != "" && localStorageService.get("ifLogin") == "0") {
        if (localStorageService.get("roleType") == '0' || localStorageService.get("roleType") == '4') {
            var data = {gotoData: {url: 'tab.dealList'}};
            JumpUtil.goFun(data);
        } else if (localStorageService.get("roleType") == '1') {
            var data = {gotoData: {url: 'tab.haullist'}};
            JumpUtil.goFun(data);
        }
        return;
    }
    $scope.accountLogin = function () {
        var data = {backData: {data: {backUrl: 'login', level: 1}}, gotoData: {url: 'accountLogin'}};
        JumpUtil.goFun(data);
    }

    $scope.login = function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                LoadUtil.showLoad('登录中');
                if(!angular.equals("", result.text)){
                    //var personInfo = encodeURIComponent(encodeURIComponent(result.text));
                    var str = CryptoJS.enc.Utf8.parse(result.text);
                    var personInfo = CryptoJS.enc.Base64.stringify(str);
                    Init.iwbhttp("/login/loginForPDAScanner", {"personInfo": personInfo}, function (data, header, config, status) {
                        if (data.resFlag == "0") {
                            $rootScope.roleType = localStorageService.get("roleType");
                            var data = {};
                            if ($rootScope.roleType == '0' || $rootScope.roleType == '4') {
                                data = {gotoData: {url: 'tab.dealList'}};
                            } else if ($rootScope.roleType == '1') {
                                data = {gotoData: {url: 'tab.haullist'}};
                            }
                            LoadUtil.hideLoad();
                            JumpUtil.goFun(data);
                            $("#pwd").val("");
                        } else {
                            LoadUtil.hideLoad();
                            /*Alert.alertTemplate({title: "提示", content: data.msg}, function (res) {
                            });*/
                            Alert.myToastBottom({mess: data.msg, height: -160});
                        }
                    }, function (data, header, config, status) {
                        //LoadUtil.hideLoad();
                        //Alert.myToastBottom({mess: "服务器未知异常", height: -160});
                    });
                }else{
					LoadUtil.hideLoad();
                    /*Alert.alertTemplate({title:"提示",content:"未扫描到二维码，请重新扫描！"},function(res){
					})*/
                    Alert.myToastBottom({mess: "未扫描到二维码，请重新扫描！", height: -160});
                }
            },
            function (error) {
                //alert("Scanning failed: " + error);
            },
            {
                preferFrontCamera: false, // iOS and Android
                showFlipCameraButton: true, // iOS and Android
                showTorchButton: true, // iOS and Android
                torchOn: false, // Android, launch with the torch switched on (if available)
                prompt: "请将二维码放在扫描框中", // Android
                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                orientation: "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
            }
        );
    }

    var count = 5;
    $scope.setIpProt = function () {
        var toId = null;
        if (count == 5) {
            toId = window.setTimeout(clearCount, 5000);
        }
        if (count == 1) {
            // 自定义弹窗
            var myPopup = $ionicPopup.show({
                template: '<div class="item item-input item-text">' +
                '<input type="text"  placeholder="普通后台地址" ' +
                'style="font-size: 15px;width: 120px;"  ng-model="$root.baseUrl"></div>' +
                '<div class="item item-input item-text">' +
                '<input type="text"   placeholder="普元后台地址" ' +
                'style="font-size: 15px;width: 120px;"  ng-model="$root.baseUrlEos"></div>',
                title: '服务器后台服务器IP端口修改',
                scope: $scope,
                buttons: [
                    {text: '关闭', type: 'button-positive button-my'}
                ]
            });
        }
        else {
            //alert("再点击"+(--count)+"次就可以修改后台服务器地址！");
            Alert.myToastBottom({mess: "再点击" + (--count) + "次就可以修改后台服务器地址！", height: -160});
        }
    }

    function clearCount() {
        count = 5;
    }

    $scope.test = function(){

            var url = cordova.file.applicationDirectory+"www/msg.mp3"
            var my_media = new Media(url,
                // success callback
                function () {
                    alert("playAudio():Audio Success");
                },
                // error callback
                function (err) {
                    alert("playAudio():Audio Error: " + err);
                }
            );
            // Play audio
            my_media.play();
        }

}])
