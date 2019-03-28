/*
create by woody
date 20170301
审批页面controller
*/
angular.module('myapp').controller('TodoListCtrl',['$scope','$state',function($scope,$state) {
	  $scope.todolist = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'project/res/img/ben.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'project/res/img/max.png'
    }, {
      id: 2,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'project/res/img/adam.jpg'
    }, {
      id: 3,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'project/res/img/perry.png'
    }, {
      id: 4,
      name: 'Mike Harrington',
      lastText: 'This is wicked good ice cream.',
      face: 'project/res/img/mike.png'
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
    $scope.goFunc = function(obj,params){
        $state.go(obj,{data:params});
       
    };
}])