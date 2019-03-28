/**
 * Created by woody on 2015/11/10.
 */
angular.module('myapp').factory('LoadUtil', ['$ionicLoading',function($ionicLoading){
    var alertRes = {
        showLoad : function(text){
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-stable"></ion-spinner><h6>'+text+'...</h6>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        },
        hideLoad : function(){
            $ionicLoading.hide();
        }
    };
    return alertRes;
}]);
//修改编码

