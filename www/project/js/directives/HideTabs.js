/*
create by woody
date 20170303
二级页面隐藏底部tab栏
*/
angular.module('myapp').directive('hideTabs', function($rootScope) {  
  return {  
    restrict: 'AE',  
    link: function(scope, element, attributes) {  
      scope.$on('$ionicView.beforeEnter', function() {  
        scope.$watch(attributes.hideTabs, function(value){  
          $rootScope.hideTabs = 'tabs-item-hide';  
        });  
      });  
      scope.$on('$ionicView.beforeLeave', function() {  
        scope.$watch(attributes.hideTabs, function(value){  
          $rootScope.hideTabs = 'tabs-item-hide';  
        });  
        scope.$watch('$destroy',function(){  
          $rootScope.hideTabs = '';  
        })  
      });  
    }  
  };  
}); 