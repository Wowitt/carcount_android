/**
 * Created by woody on 2015/11/10.
 */
angular.module('myapp').factory('Confirm', ['$ionicPopup',function($ionicPopup){
    var confirmRes = {
        confirmTemplate : function(data,myThen){
            $ionicPopup.confirm({
                template: '<div align="center">'+data.content+'</div>',
                cancelText: '取消',
                okType: 'button-positive btn-p',
                okText: '确定'
            }).then(function(res) {
                myThen(res);
            });
        }
    };
    return confirmRes;
}]);

