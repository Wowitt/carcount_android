/**
 * Created by woody on 2015/11/10.
 */
angular.module('myapp').factory('JumpUtil', ['$rootScope','$state','$ionicViewSwitcher',function($rootScope,$state,$ionicViewSwitcher){
    var alertRes = {
        addBackInfo : function(data){
            $rootScope.barkInfoArray[$rootScope.barkInfoArray.length]=data;
        },
        goBackFun : function(){
            $ionicViewSwitcher.nextDirection('back');
            //$ionicViewSwitcher.nextTransition('ios');//造成卡顿所以注销掉
            var index=$rootScope.barkInfoArray.length-1;
            var path=$rootScope.barkInfoArray[index].data.backUrl;
            var param=$rootScope.barkInfoArray[index]
            $rootScope.barkInfoArray.pop();
            if(param.data.level == 1)
            {
                $state.go(path);
            }
            else
            {
                $state.go(path,param);
            }
        },
        goFun : function(data){
            //console.log("result="+JSON.stringify(data));
            $ionicViewSwitcher.nextDirection('forward');
            //$ionicViewSwitcher.nextTransition('ios');
            alertRes.addBackInfo(data.backData);
            if(data.gotoData.param == undefined)
            {
                $state.go(data.gotoData.url);
            }
            else
            {
                $state.go(data.gotoData.url,data.gotoData.param);
            }
        }
    };
    return alertRes;
}]);
//修改编码

