/*
 created by woody
 date 2017-03-01
 程序入口,引用第三方库,配置路由,http拦截器
 */
var myapp = angular.module('myapp', ['ionic', 'LocalStorageModule', 'ngCordova','ngWebSocket'])
myapp.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function ($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.scrolling.jsScrolling(true);
    $stateProvider.state('tab', {
        url: '/tab',
        abstract: true,
        cache: 'false',
        templateUrl: 'project/templates/tabs.html',
        controller: 'TabsCtrl'
    })
        // Each tab has its own nav history stack:
        .state('tab.search', {
            url: '/search',
            views: {
                'tab-search': {
                    templateUrl: 'project/templates/tab-search.html',
                    controller: 'SearchCtrl'
                }
            }
        })
        .state('tab.todolist', {
            url: '/todolist',
            views: {
                'tab-todolist': {
                    templateUrl: 'project/templates/tab-todolist.html',
                    controller: 'TodoListCtrl'
                }
            }
        })
        .state('tab.todolist-detail', {
            url: '/todolist',
            views: {
                'tab-todolist': {
                    templateUrl: 'project/templates/tab_todolist/detail.html',
                    controller: 'TodoListDetailCtrl'
                }
            },
            params: {'data': null}
        })
        .state('tab.todolist-detail-2', {
            url: '/todolist',
            views: {
                'tab-todolist': {
                    templateUrl: 'project/templates/tab_todolist/detail_2.html'
                }
            }
        })
        .state('tab.account', {
            url: '/account',
            views: {
                'tab-account': {
                    templateUrl: 'project/templates/tab-account.html',
                    controller: 'AccountCtrl'
                }
            }
        })
        // 设置页面 setting  by ouyang 2017-04-06 start
        .state('tab.setting', {
            url: '/setting',
            views: {
                'tab-setting': {
                    templateUrl: 'project/templates/setting/setting.html',
                    controller: 'SettingCtrl'
                }
            }
        })
        // 设置页面 setting  by ouyang 2017-04-06 end
        // 登录功能 login  by ouyang 2017-04-06 start
        // 扫码登录
        //.state('tab.login', {
        //    url: '/setting',
        //    views: {
        //        'tab-setting': {
        //            templateUrl: 'project/templates/setting/login.html',
        //            controller: 'LoginCtrl'
        //        }
        //    }
        //})
        .state('login', {
            url: '/login',
            cache: 'false',
            templateUrl: 'project/templates/setting/login.html',
            controller: 'LoginCtrl'
        })
        .state('carcount', {
            url: '/carcount',
            cache: 'false',
            templateUrl: 'project/templates/car/carcount.html',
            controller: 'CarcountCtrl',
            params: {'data': null}
        })
        // 账号登录
        //.state('tab.accountLogin', {
        //    url: '/setting',
        //    views: {
        //        'tab-setting': {
        //            templateUrl: 'project/templates/setting/accountLogin.html',
        //            controller: 'AccountLoginCtrl'
        //        }
        //    }
        //})
        .state('accountLogin', {
            url: '/accountLogin',
            cache: 'false',
            templateUrl: 'project/templates/setting/accountLogin.html',
            controller: 'AccountLoginCtrl'
        })
        // 登录功能 login  by ouyang 2017-04-06 end

        // 查看历史处置记录 dealHistoryList  by ouyang 2017-04-06 start （for 现场处置人员）
        .state('tab.dealHistoryList', {
            url: '/dealHistoryList',
            cache:false,
            views: {
                'tab-dealHistoryList': {
                    templateUrl: 'project/templates/setting/dealHistoryList.html',
                    controller: 'DealHistoryListCtrl'
                }
            }
        })
        //.state('dealHistoryList', {
        //    url: '/dealHistoryList',
        //    cache: 'false',
        //    templateUrl: 'project/templates/setting/dealHistoryList.html',
        //    controller: 'DealHistoryListCtrl'
        //})
        // 查看历史处置记录 dealHistoryList  by ouyang 2017-04-06 end
        // 当天处置记录 dealList  by ouyang 2017-04-06 start （for 现场处置人员）
        .state('tab.dealList', {
            url: '/dealList',
            cache: 'false',
            views: {
                'tab-dealList': {
                    templateUrl: 'project/templates/dealBill/dealList.html',
                    controller: 'DealListCtrl'
                }
            }
        })
        // 当天处置记录 dealList  by ouyang 2017-04-06 end
        // 处置医疗废物 dealAdd  by ouyang 2017-04-06 start （for 现场处置人员）
        //.state('tab.dealAdd', {
        //    url: '/dealList',
        //    views: {
        //        'tab-dealList': {
        //            templateUrl: 'project/templates/dealBill/dealAdd.html',
        //            controller: 'DealAddCtrl'
        //        }
        //    }
        //})
        .state('dealAdd', {
            url: '/dealAdd',
            cache: 'false',
            templateUrl: 'project/templates/dealBill/dealAdd.html',
            controller: 'DealAddCtrl'
        })
        // 处置医疗废物 dealAdd  by ouyang 2017-04-06 end
        // 行程列表 haullist  by weizanting 2017-04-06 start
        .state('tab.haullist', {
            url: '/haullist',
            views: {
                'tab-haullist': {
                    templateUrl: 'project/templates/tab-haullist.html',
                    controller: 'HaulListCtrl'
                }
            }
        })
        // 行程列表 haullist  by weizanting 2017-04-06 end
        // 新增行程 addhaul  by weizanting 2017-04-06 start
        .state('addhaul', {
            url: '/addhaul',
            cache: 'false',
            templateUrl: 'project/templates/tab-haullist/addhaul.html',
            controller: 'AddHaulCtrl'
        })
        // 新增行程 addhaul  by weizanting 2017-04-06 end
        // 运单列表 billlist  by weizanting 2017-04-06 start
        .state('billlist', {
            url: '/billlist',
            cache: 'false',
            templateUrl: 'project/templates/tab-haullist/billlist.html',
            controller: 'BillListCtrl',
            params: {'data': null}
        })
        // 运单列表 billlist  by weizanting 2017-04-06 end
        // 新增运单 addbill  by weizanting 2017-04-06 start
        .state('addbill', {
            url: '/addbill',
            cache: 'false',
            templateUrl: 'project/templates/tab-haullist/addbill.html',
            controller: 'AddBillCtrl',
            params: {'data': null}
        })
    // 新增运单 addbill  by weizanting 2017-04-06 end
    // 行程历史列表 haulHistorylist  by weizanting 2017-06-26 start
    .state('tab.haulhistorylist', {
        url: '/haulhistorylist',
        views: {
            'tab-haulhistorylist': {
                templateUrl: 'project/templates/tab-haullist/tab-haulHistorylist.html',
                controller: 'HaulHistoryListCtrl'
            }
        }
    });
    // 行程历史列表 haulHistorylist  by weizanting 2017-06-26 end
    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/tab/setting');
    //http
    $httpProvider.interceptors.push(['$rootScope', function ($rootScope) {
        return {
            'request': function (config) {
                return config;
            },
            'response': function (config) {
                return config;
            }
        };
    }]);

}]);
/*
 created by woody
 date 2017-03-01
 启动程序
 配置基本变量
 */
myapp.run(['$ionicPlatform', '$state', '$rootScope', 'localStorageService', '$ionicNavBarDelegate', '$cordovaDevice', '$ionicHistory', '$location', 'Alert', 'JumpUtil', '$cordovaKeyboard', function ($ionicPlatform, $state, $rootScope, localStorageService, $ionicNavBarDelegate, $cordovaDevice, $ionicHistory, $location, Alert, JumpUtil, $cordovaKeyboard) {
    document.addEventListener("deviceready", function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        $rootScope.device = $cordovaDevice.getDevice();
        $rootScope.uuid = $cordovaDevice.getUUID();
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        $ionicPlatform.registerBackButtonAction(function (e) {
            //var backInfo = $ionicHistory.backView();
            //var ifLoginFlag = localStorageService.get("ifLogin") != undefined && localStorageService.get("ifLogin") != null && localStorageService.get("ifLogin") != "" && localStorageService.get("ifLogin") == "0";
            //if((ifLoginFlag && (backInfo.stateId == "tab.login" || backInfo.stateId == "tab.accountLogin")) || (!ifLoginFlag && backInfo.stateId == "tab.setting")){
            //}else{
            //    $ionicHistory.goBack();
            //    e.preventDefault();
            //    return false;
            //}
            //判断处于哪个页面时双击退出
            var path = $location.path().substr(0, 4);
            if ($location.path() != "") {
                if (path == '/tab' || $location.path() == '/login') {
                    if ($rootScope.backButtonPressedOnceToExit) {
                        ionic.Platform.exitApp();
                    } else {
                        $rootScope.backButtonPressedOnceToExit = true;
                        Alert.myToastBottom({mess: "再按一次退出系统！", height: -160});
                        setTimeout(function () {
                            $rootScope.backButtonPressedOnceToExit = false;
                        }, 2000);
                    }
                }
                else {
                    JumpUtil.goBackFun();
                }
            } else if ($ionicHistory.backView()) {
                if ($cordovaKeyboard.isVisible()) {
                    $cordovaKeyboard.close();
                } else {
                    $ionicHistory.goBack();
                }
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                Alert.myToastBottom({mess: "再按一次退出系统！", height: -160});
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
            e.preventDefault();
        }, 101);

//        $rootScope.baseUrl = 'http://60.30.64.249:7080/rd_2nd';
//        $rootScope.baseUrl = 'http://192.168.31.233:9002/api';
        $rootScope.baseUrl = 'http://39.96.42.117:9000/api';
        $rootScope.baseUrlEos = '';
        $rootScope.baseUrlPath = '';
        $rootScope.hideTabs = '';
        $rootScope.roleType = '0';  //0-现场处置人员，1-司机，2-车，3-产生管理员，4-处置管理员，5-交接员
        $rootScope.barkInfoArray = [];
        // ============= websocket start=================
        $rootScope.websocketUrlController = '';
//        $rootScope.websocketUrl = 'ws://60.30.64.249:7080';
        $rootScope.websocketUrl = 'ws://192.168.31.233:9002';
        $rootScope.websocketController = '/mywebsocket';
        $rootScope.msgId = '';
        $rootScope.msgText = '';
        $rootScope.msgDate = '';
        // ============= websocket end=================
        if (localStorageService.get("roleType") != undefined && localStorageService.get("roleType") != null && localStorageService.get("roleType") != "") {
            $rootScope.roleType = localStorageService.get("roleType");
        }
        $rootScope.const = {
            tab1: {
                header_title: '行程列表',
                tab_title: '业务'
            },
            tab2: {
                header_title: '设置',
                tab_title: '设置'
            },
            tab3: {
                header_title: '新增行程'
            },
            tab4: {
                header_title: '运单列表'
            },
            tab5: {
                header_title: '新增运单'
            },
            tab6: {
                header_title: '历史',
                tab_title: '历史'
            }
        };
//        localStorageService.set("ifLogin","")
        if (localStorageService.get("ifLogin") == undefined || localStorageService.get("ifLogin") == null || localStorageService.get("ifLogin") == "" || localStorageService.get("ifLogin") != "0") {
            $state.go("accountLogin");
        } else {
            $state.go("carcount")
        }
//$state.go("carcount")
    }, false);
}])
