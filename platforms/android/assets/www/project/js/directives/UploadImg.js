/**
 * Created by woody on 2015/11/8.
 */
angular.module('myapp').directive('uploadImg',['$document','Init',function($document,Init){
    var uploadImg = function(obj){
        var postData={imgBase64:obj};
        Init.iwbhttp('/user/uploadImg',postData,function(data,header,config,status){
        },function(data,header,config,status){
        });
    }
    return {
        restrict: 'E',
        template:'<input accept="image/*" id="file" type="file"/>',
        link:function($scope, $element, $attr){
            document.querySelector('#file').addEventListener('change', function () {
                var that = this;
                lrz(that.files[0], {
                    width: 800
                })
                .then(function (rst) {
                    //document.getElementsByClassName('userImg-Selector').src=rst.base64;
                    //document.getElementsByClassName('userImg-User-Selector').src=rst.base64;
                    uploadImg(rst.base64);
                    return rst;
                });
            });
        }
    };
}]);