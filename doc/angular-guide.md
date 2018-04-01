# 1 angular 代码规范建议
## 1.1 文件命名
controller 以 .controller 结尾  
service 以 .service 结尾  
directive 以 .directive 结尾  
module 以 .module 结尾  
filter 以 .filter 结尾  

## 1.2 模块命名
angular.module 命名的模块建议单独新建一个以 .module 后缀命名的文件定义；  
module 驼峰命名，有父子关系的 module 以 . 号分割表示父子关系，例如 angular.module('a', [])，angular.module('a.b', []);  
controller 驼峰命名，以 Ctrl结尾，具有父子关系嵌套的 controller 命名以 . 号分割表示父子关系；  
service/factory/provider 驼峰命名，以 Ser结尾；  
directive 驼峰命名，通用、跨项目的指令集以 公司简称 作为前缀，从属于项目业务性的指令建议使用项目名称简写作为前缀；  
filter 驼峰命名；
由于 controller/service 是以angular.module('moduleName', []).xxx的形式定义在module上的，故业务性的、非全局基础功能代码的 controller/service 的命名建议以 moduleName.xxxCtrl/moduleName.xxxSer 的形式

## 1.3 代码书写建议
### 1.3.1 controller 的启动代码书写
controller 是数据模型 model 和页面视图 view 交互的逻辑代码，页面的数据绑定和事件绑定是通过 controller 来实现响应的，页面的启动逻辑也是在 controller 中实现，应该把启动逻辑放在 controller 的固定位置，避免 controller 到处都有启动逻辑的代码，便于代码阅读维护。建议把启动代码封装到一个叫 initPage() 或者 activate() 函数中。

### 1.3.2 函数书写
函数的定义，特别在 controller 中建议采用 function 关键字声明，减少函数表达式的使用，例如 var getData = function() {} 可改成 function getData() {} 的形式；  
使用函数声明隐藏细节，把绑定 scope 上的变量和事件的代码放到 controller 的开始位置；  
### 1.3.3 controller 中避免直接定义大量从属于 scope 对象的变量
非数据双向绑定和事件绑定的变量不要定义在 scope 对象上；  
需要定义在 scope 对象上的双向绑定的数据变量，应根据业务逻辑或者页面交互控制逻辑做好规划组织，避免大量直接裸露在 scope 对象上的变量，例如以下不好的示例：
```javascript
//下面定义的是页面上搜索栏的查询条件
$scope.beginTime =  new Date().getTime() - 24*3600*1000*30,
$scope.endTime =  new Date().getTime() + 24*3600 *1000*30,
$scope.status = '';
$scope.type =  '1';
$scope.enteName = '';
```
像上面直接定义了大量变量在 scope 对象上，是不可取的，修改如下：
```javascript
$scope.search = {
	beginTime: new Date().getTime() - 24*3600*1000*30,
	endTime: new Date().getTime() + 24*3600 *1000*30,
	status: '',
	type: '1',
	enteName: ''
};
```

### 1.3.4 注入依赖使用手动注入模式
给 controller/service/directive 等模块代码注入依赖不能使用简化的方式，使用内联数组依赖的方式，否则代码打包压缩将会报错。
例：
```javascript
angular.module('transfer', ['ui.grid', 'ui.grid.selection', 'ui.grid.edit'])
    .controller('transfer.todoCtrl', ['$scope', '$http', 'girdSetting', function(scope, $http, girdSetting) {    	

    }])
```
### 1.3.5 尽量把 controller 的具体代码逻辑放到 service 中实现
直接在 controller 中书写逻辑：
```javascript
angular.module('Store', [])
.controller('OrderCtrl', function ($scope) {

  $scope.items = [];

  $scope.addToOrder = function (item) {
    $scope.items.push(item);//-->控制器中的业务逻辑
  };

  $scope.removeFromOrder = function (item) {
    $scope.items.splice($scope.items.indexOf(item), 1);//-->控制器中的业务逻辑
  };

  $scope.totalPrice = function () {
    return $scope.items.reduce(function (memo, item) {
      return memo + (item.qty * item.price);//-->控制器中的业务逻辑
    }, 0);
  };
});
```
可修改如下：
```javascript
// Order 在此作为一个 'model'
angular.module('Store', [])
.controller('OrderCtrl', ['Order',function (Order) {

  $scope.items = Order.items;

  $scope.addToOrder = function (item) {
    Order.addToOrder(item);
  };

  $scope.removeFromOrder = function (item) {
    Order.removeFromOrder(item);
  };

  $scope.totalPrice = function () {
    return Order.total();
  };
}]);
```

### 1.3.6 其他
$timeout 替代 setTimeout  
$interval 替代 setInterval  
$window 替代 window  
$document 替代 document

### 1.3.7 一个完整的例子
```javascript
angular.module('demo', [])
    .controller('demo.todoCtrl', ['$scope', '$http', 'girdSetting', 'dialogService', 'user', 'utils', function ($scope, $http, girdSetting, dialogService, user, utils) {
    	/***************scope变量及事件***********************/
    	$scope.search = {
        		beginTime: new Date().getTime() - 24*3600*1000*30,
        		endTime: new Date().getTime() + 24*3600 *1000*30,
        		status: '',
        		type: '1',
        		enteName: '',
        		isSearching: false
        };
        $scope.seeTransfer = seeTransfer;
        $scope.confirmTransfer = confirmTransfer;
        $scope.adjustTransfer = adjustTransfer;
        $scope.searchItem = getPage;

		/***************启动逻辑***********************/
        var activate = function() {	        
	        $scope.$on('transfer.todoCtrl.updateData', function() {
	        	$scope.searchItem();
	        });
	        getPage(1, $scope.gridOptions.paginationPageSize);
        };

		activate(); //启动代码
        
        /***************函数声明定义***********************/
        function adjustTransfer(transfer) {
        	$scope.updateTabOuter({
                index: '2-3',
                title: transfer.type,
                controller: 'transfer.city.editCtrl',
                groupId: 3,
                resolve: {
                	user: function() {
                		return user;
                	},
                	transfer: {planId: transfer.objectid, taskid: transfer.taskid}
                },
                content: "partials/transport/transferForm/adjustTransfer.html"
            });
        };
        
        function confirmTransfer(transfer) {
        	$scope.updateTabOuter({
                index: '2-4',
                title: transfer.type,
                controller: 'transfer.city.editCtrl',
                groupId: 3,
                resolve: {
                	user: function() {
                		return user;
                	},
                	transfer: {planId: transfer.objectid, taskid: transfer.taskid}
                },
                content: "partials/transport/transferForm/confirmTransfer.html"
            });
        };
        
        function seeTransfer(transfer) {
        	$scope.updateTabOuter({
                index: '2-2',
                title: "详情",
                controller: 'transfer.city.editCtrl',
                groupId: 3,
                resolve: {
                	user: function() {
                		return user;
                	},
                	transfer: {planId: transfer.objectid, taskid: transfer.taskid},
                	type: function() {
                		return 'detail';
                	}
                },                  
                content: "partials/transport/transferForm/seeTransfer.html"
            });
        }
        
        function getPage(curPage, pageSize) {    	    	
        	$scope.search.isSearching = true;
        	$http({	    	
	        	method: 'POST',
	              url: 'xxxxx',
	    	}).then(function(res) {
	    	            $scope.gridOptions.totalItems = res.data && res.data.totalCount;
                                        $scope.gridOptions.data = res.data && res.data.dataList;                
                                        $scope.search.isSearching = false;
	    	}, function() {
	    		$scope.search.isSearching = false;
	    	});
	    }         
               
    }])
```

# 2 参考资料
[github 上的 angularjs 代码规范建议](https://github.com/mgechev/angularjs-style-guide/blob/master/README-zh-cn.md)  
[google 的 angularjs 代码规范](https://google.github.io/styleguide/angularjs-google-style.html)  
[angular 风格指南](http://www.reqianduan.com/1722.html)

@author zjf