/*
create by woody
date 20170301
查询页面controller
*/
angular.module('myapp').controller('SearchCtrl',['$scope','$ionicSlideBoxDelegate',function($scope,$ionicSlideBoxDelegate) {
	$scope.tabNames=['处置协议','转移计划','转移联单','测试测试1','测试测试2','测试测试3'];
	$scope.slectIndex=0;
	$scope.activeSlide=function(index){//点击时候触发
	    $scope.slectIndex=index;
	    $ionicSlideBoxDelegate.slide(index);
	};
	$scope.slideChanged=function(index){//滑动时候触发
		//向右滑
		var tabNames_LastIndex = $scope.tabNames.length-1;
		var width = document.body.offsetWidth;
		if($scope.slectIndex < index)
		{
			if(index>1 && index<tabNames_LastIndex)
			{
				var left = $scope.slectIndex*width*0.3;
				// console.log("left===>>"+left);
				$("#tab-search-header-tab").scrollLeft(left);
			}
			
		}
		else  //向左滑
		{
			if(index>0 && index<tabNames_LastIndex-1)
			{
				var left = (index-1)*width*0.3;
				// console.log("left===>>"+left);
				$("#tab-search-header-tab").scrollLeft(left);
			}
		}
	    $scope.slectIndex=index;
	};
	$scope.pages=["project/templates/search_tabs/tab01.html","project/templates/search_tabs/tab02.html","project/templates/search_tabs/tab03.html","project/templates/search_tabs/tab04.html","project/templates/search_tabs/tab05.html","project/templates/search_tabs/tab06.html"];
}])