/**
 * Created by woody on 2015/10/7.
 */
angular.module('myapp').factory('Init', ['$http','$rootScope','localStorageService','Alert','LoadUtil','JumpUtil',function($http,$rootScope,localStorageService,Alert,LoadUtil,JumpUtil){
    var userInit = function(data)
    {
        localStorageService.set('IWBSESSION',data.IWBSESSION);
        localStorageService.set('userName',data.userName);
        localStorageService.set('ifLogin',data.ifLogin);
        localStorageService.set('userId',data.userId);
        localStorageService.set('roleType',data.userType);
        //console.log("init====>"+data.userType);
        if(data.userPortrait == '' || data.userPortrait == null || data.userPortrait == undefined)
        {
            localStorageService.set('userPortrait','');
            $rootScope.userPortrait = $rootScope.loginPic;
        }
        else
        {
            localStorageService.set('userPortrait',$rootScope.baseUrl+data.contextPath+data.userPortrait);
            $rootScope.userPortrait = localStorageService.get('userPortrait');
        }
        if(data.ifLogin == '1')
        {
            $rootScope.userName = data.userName;
            $rootScope.tel = data.tel;
            $rootScope.mail = data.mail;
            $rootScope.loginUrl = 'user';
            $rootScope.userId = data.userId;
        }else
        {
            $rootScope.nickName = $rootScope.logintitle;
        }

    };
    var myhttp = function(url,data,success,error){
        if(navigator.connection.type == "wifi" || navigator.connection.type == "cell_2g" || navigator.connection.type == "cell_3g" || navigator.connection.type == "cell_4g")
        {
            data['IWBSESSION'] = localStorageService.get('IWBSESSION');
            data['DEVICE_UUID'] = $rootScope.uuid;
            //data['DEVICE_UUID'] = "11";
            $http({
                url:$rootScope.baseUrl+$rootScope.baseUrlPath+url,
                data: "params="+JSON.stringify(data),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST'
                //method:'GET'
            }).success(function(data,header,config,status){
                console.log('========success==============');
                // localStorageService.set('IWBSESSION',data.IWBSESSION);
                if(url != '/login/getCarPlan'){
                    userInit(data);
                }
                success(data,header,config,status);
            }).error(function(data,header,config,status){
                console.log('========error==============');
                if(localStorageService.get('ifLogin') != '1')
                {
                    $rootScope.nickName = $rootScope.logintitle;
                    $rootScope.userPortrait = $rootScope.loginPic;
                }else{
                    $rootScope.nickName = localStorageService.get('nickName');
                    $rootScope.userId = localStorageService.set('userId');
                    $rootScope.userPortrait = $rootScope.loginPic;
                    $rootScope.loginUrl = 'user';
                }
                LoadUtil.hideLoad();
                Alert.myToastBottom({mess: "服务器未知异常", height: -160});
                error(data,header,config,status);
            });
        }else{
            if(url == '/user/logout'){
                LoadUtil.hideLoad();
                var data={gotoData:{url:'login'}};
                Alert.myToastBottom({mess: "注销成功！", height:-160});
                localStorageService.clearAll();
                JumpUtil.goFun(data);
            }else{
                LoadUtil.hideLoad();
                Alert.myToastBottom({mess:"网络无法连接",height:-160});
                return true;
            }
        }
    };
    var initRes = {
        iwbhttp : function(url,data,success,error){
            myhttp(url,data,success,error);
        },
        eoshttp : function(data,success,error){
            myhttp('',data,success,error);
        }
    };
    return initRes;
}]);
