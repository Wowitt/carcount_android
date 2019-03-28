/**
 * Created by woody on 2015/11/10.
 */
angular.module('myapp').factory('Alert', ['$ionicPopup',function($ionicPopup){
    var alertRes = {
        alertTemplate : function(data,myThen){
            $ionicPopup.alert({
                template: '<div align="center">'+data.content+'</div>',
                okType: 'button-positive button-my',
                okText: '关闭'
            }).then(function (res) {
                myThen(res);
            });
        },
        myToastBottom : function(data){
            window.plugins.toast.showWithOptions(
                {
                    message: data.mess,
                    duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                    position: "bottom",
                    addPixelsY: data.height  // added a negative value to move it up a bit (default 0)
                },
                function (){
                }, // optional
                function (){
                }
            )
        }
    };
    return alertRes;
}]);

