/*
create by woody
date 20170301
审批页面controller
*/
angular.module('myapp').controller('DealHistoryListCtrl',['$scope','$state',function($scope,$state) {
	  $scope.deallist = [{
      id: 0,
      username: '张珊',
      boxNum: '50',
      dealTime: '2017-03-12 12:12'
    }, {
      id: 1,
          username: '张珊',
          boxNum: '30',
          dealTime: '2017-03-12 12:00'
    }, {
      id: 2,
      username: '李四',
      boxNum: '60',
      dealTime: '2017-03-12 11:12'
    }, {
      id: 3,
      username: '张三',
      boxNum: '50',
      dealTime: '2017-03-12 11:00'
    }, {
      id: 4,
      username: '张珊',
      boxNum: '50',
      dealTime: '2017-03-12 10:12'
    }];
    $scope.all = function() {
      return todolist;
    };
    $scope.remove =  function(todolist_item) {
      $scope.todolist.splice($scope.todolist.indexOf(todolist_item), 1);
    };
    
  	$scope.doRefresh = function() {
        
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    };
    $scope.doRefresh();
    $scope.pageRefresh = function(){
        
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    $scope.add = function(){
        $state.go("tab.dealAdd");
       
    };
}])