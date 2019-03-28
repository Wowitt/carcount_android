/*
create by woody
date 20170301
审批明细页面controller
*/
angular.module('myapp').controller('TodoListDetailCtrl',['$scope','$stateParams','$state','$ionicHistory','Init',function($scope, $stateParams,$state,$ionicHistory,Init) {
	// console.log(JSON.stringify($stateParams.data));
    // $scope.todolist_item = TodoList.get($stateParams.itemId);
    $scope.itemId = $stateParams.data.itemId;
    $scope.todolist_item = $stateParams.data.item;
	$scope.mygo = function()
	{
		$state.go("tab.todolist-detail-2");
        //$ionicHistory.clearHistory();
	}
	$scope.test = function()
	{
		var params = {test:'hellowoody'};
		Init.eoshttp(params,function(data,header,config,status){
        },function(data,header,config,status){
        });
	}
}])