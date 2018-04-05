[TOC]

# 1 nodejs 和 npm
## 1.1 安装node.js和npm
window下载安装.msi安装包，安装包会附带把node.js的包管理工具npm自动安装上。  

安装完成后，查看node.js版本,cmd命令行：  
	node -v

查看npm版本，cmd命令行：  
	npm -v

## 1.2 npm 介绍
npm 是nodeJs的包管理工具，用于node插件的安装，卸载，依赖管理。  

使用npm安装插件，命令行执行：`npm install <name> [-g] [--save -dev]`,参数说明如下：     
	name: 要安装的插件名字，例如 npm install jquery    
	-g: 表示全局安装，一般会安装在 系统盘:\Users\Administrator\AppData\Roaming\npm目录下，并且写入系统环境变量，可使用命令行全局执行调用。  
		本地安装则会安装在当前定位目录node_modules文件夹下，在代码中通过require调用。   
	--save：将信息保存在package.json的dependencies节点中。     
	-dev：将信息保存在package.json的devDependencies节点中。  

使用npm卸载插件，`npm uninstall <name> [-g][--save-dev] `  

使用npm更新插件，`npm update <name> [-g][--save-dev]`,更新全部插件 `npm update [--save-dev]`    

查看npm帮助，`npm help `  

当前目录已安装插件：`npm list`  

# 2 安装及使用gulp.js
## 2.1 全局安装gulp.js
	npm install gulp -g
	安装后查看版本号 gulp -v
## 2.2  本地目录安装gulp.js
	npm install gulp --save-dev
## 2.3 初始化配置package.json
	可手动新建文件package.json，也可使用 npm init自动生成。
	package.json大致是如下格式的配置文件：
```javascript
		{
		  "name": "test",   //项目名称（必须）
		  "version": "1.0.0",   //项目版本（必须）
		  "description": "This is for study gulp project !",   //项目描述（必须）
		  "homepage": "",   //项目主页
		  "repository": {    //项目资源库
		    "type": "git",
		    "url": "https://git.oschina.net/xxxx"
		  },
		  "author": {    //项目作者信息
		    "name": "surging",
		    "email": "surging2@qq.com"
		  },
		  "license": "ISC",    //项目许可协议
		  "devDependencies": {    //项目依赖的插件
		    "gulp": "^3.8.11",
		    "gulp-less": "^3.0.0"
		  }
		}
```
## 2.4 新建gulpfile.js文件
 gulpfile.js是gulp的配置文件，位于项目根目录下，一个简单的示例如下：
```javascript
 	//导入工具包 require('node_modules里对应模块')
	var gulp = require('gulp'), //本地安装gulp所用到的地方
	    less = require('gulp-less');
	 
	//定义一个testLess任务（自定义任务名称）
	gulp.task('testLess', function () {
	    gulp.src('src/less/index.less') //该任务针对的文件
	        .pipe(less()) //该任务调用的模块
	        .pipe(gulp.dest('src/css')); //将会在src/css下生成index.css
	});
	 
	gulp.task('default',['testLess', 'elseTask']); //定义默认任务 elseTask为其他任务，该示例没有定义elseTask任务
	 
	//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
	//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组) 
	//gulp.dest(path[, options]) 处理完后文件生成路径
```
## 2.5 参考链接
1.[gulp官网](http://www.gulpjs.com.cn/docs/api/)  
2.[gulp入门](https://www.kancloud.cn/thinkphp/gulp-guide/44001)  
3.[node下载](https://nodejs.org/en/download/)

# 3 requirejs
## 3.1 配置项
 baseUrl: 所查找的模块的根路径   
 paths: 加载模块的路径，相对于 baseUrl     
 shim: 对没有使用define()来声明依赖关系、设置模块的脚本声明依赖和导出配置  
 waitSeconds：放弃加载一个脚本之前等待的秒数。设为0禁用等待超时。默认为7秒

## 3.2 常用 API
### 3.2.1 require.config()
require.config 用于设置配置项
```javascript
require.config({
    baseUrl: './',
    waitSeconds: 0,
    paths: {
    	'jquery': 'js/jquery',
    	'backbone': 'js/backbone',
    	'underscore': 'js/underscore'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }
});
```
### 3.2.2 define()
define 用于定义一个模块
```javascript
//直接定义变量
define({
	name: 'jj',
	sex: 'mail'
});

//通过函数来定义模块
define(function() {
	.....
	return {
		name: 'jj',
		sex: 'mail'
	}
});

//定义带有依赖的模块
define(['jquery', 'angular'], function($, angular) {
	var name = 'Jj';
	var sex = 'mail';
	return {
            name: name,
			sex: sex,
            lowercaseName: function() {
                return angular.lowercase(name);
            }
        }
});

//完整版
define('app', ['angular'], function(angular) {
	...

});
//模块内部加载其他模块
define('app', ['angular'], function(angular) {
	require('app.module');
});
```
### 3.2.3 require()
require 用于加载依赖后启动应用
```javascript
 require(['jquery', 'angular', 'polyfill', 'app'], function($, angular) {
    	//angular.bootstrap(document, ['cqSolidWaste']); 
    });
```
### 3.3 参考链接
1.[requireJs官网](http://requirejs.org/docs/api.html)  
2.[requireJs配置学习](https://segmentfault.com/a/1190000002401665)

# 4 r.js
r.js 是 requireJs 官方推荐的配合reuqireJs打包 js 和 css 的工具
## 4.1 打包js
1. 下载 [r.js](http://requirejs.org/docs/download.html#rjs)，放在项目目录下；
2. 新建打包配置文件,例如在r.js所在目录下新建 js.build.js 文件如下：
```javascript
/*
 * @des js 打包配置
 * */
({
	baseUrl: './',
	waitSeconds: 0,
	paths: { 
    	'jquery': 'js/jquery-3.2.1.min',
        'polyfill': 'js/polyfill.min', //js 兼容旧版浏览器
        'angular': 'js/angular.min',
        'angularAnimate': 'js/angular-animate',
        'angularUiRouter': 'js/angular-ui-router.min',
        'bootstrap': 'js/bootstrap.min',
        ...
    },
    shim: { 
        'angular': {
            exports: 'angular',
            deps: ['jquery']
        }
        ...
    },
    optimize: "uglify", //压缩js
    name: 'js/requireMain', //入口启动文件
    out: './build.min.js' //打包后输出文件
});
```
3. 当前目录使用node命令执行： node r.js -o js.build.js，将会根据 js.build.js 配置文件打包输出文件 build.js

## 4.2 打包 css
1. 新建一个 build.css，导入需要压缩打包的 css
```css
@import url("bootstrap.min.css")
...
```
2. 新建css打包配置文件 css.build.css
```javascript
 /*@des css打包配置
 * */
({
    optimizeCss: "standard",//压缩css
    out : './build.min.css',
    cssIn: './build.css'
})
```
3. 运行命令： node r.js -o build.css, 将会打包输出 build.min.css

## 4.3 参考链接
1.[requireJs官网](http://requirejs.org/docs/optimization.html#options)  
2.[r.js配置学习](https://www.cnblogs.com/chen8840/p/5366984.html)

# 5 使用 SASS 预编译工具编写 css
## 5.1 安装 sass 编译环境
### 5.1.1 使用 gulp-ruby-sass 编译
1. 下载安装[Ruby](http://rubyinstaller.org/downloads)  
2. 安装 gulp-ruby-sass 插件： npm install gulp-ruby-sass --save-dev

### 5.1.2 使用 gulp-sass 编译
1. 下载安装 [python包](https://www.python.org/downloads/release/python-2714/)  
2. 安装 gulp-sass 插件： npm install gulp-sass --save-dev ,由于网络问题可能会安装失败，可安装 gulp-sass-china 代替：npm install gulp-sass-china --save-dev
## 5.2 项目中使用 sass 
1. 在 static 路径下新建 sass 文件夹，用于存放 sass 源文件，这里采用的是 scss 后缀的文件，兼容 css 语法。
2. 在 static 路径下的 css 文件夹存放的是 .scss 文件编译后输出的 css 文件。
3. 在 gulpfile.js 里面增加以下配置：
```javascript
var sass = require('gulp-sass-china');
gulp.task('sass', function() {  
    gutil.log('编译sass');
    return gulp.src('static/sass/**/*.scss')  
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))  
        .pipe(sourcemaps.write('./'))
        // 将编译后的.css文件存放在.scss文件所在目录下  
        .pipe(gulp.dest('static/css'))
});
//监听sass源文件变化，实时编译更新
gulp.task('watchsass',function (){
    gulp.watch('static/sass/**/*.scss', ['sass'])
});
```
4. 执行编译任务： gulp sass，启动实时监听编译： gulp watchsass。

## 5.3 学习资料
1. [sass文档](https://www.sass.hk/guide/)  


