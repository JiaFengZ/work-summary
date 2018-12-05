记第一个vue项目

# 1 技术选型
* 使用 `.vue` 单文件组件构建代码（[文档](https://cn.vuejs.org/v2/guide/index.html)）
* 使用 `vuex` 管理状态（[文档](https://vuex.vuejs.org/zh/guide/)）
* 使用 `vue-router` 管理页面路由（[文档](https://router.vuejs.org/zh/)）
* 使用 `axios` 作为 http 请求库([文档](https://github.com/axios/axios))
* 使用 `iview` 作为 UI 库([文档](https://www.iviewui.com/docs/guide/install))
* 可结合使用 `jsx` 语法构建 html 模版，使得具有完全编程能力书写模版（[文档](https://github.com/vuejs/babel-plugin-transform-vue-jsx)）

# 2 文件结构
```
-- public 
    -- index.html 打包入口模版html
-- src 源代码
    -- api 和服务端的数据交互
    -- components 组件代码
        -- global 全局通用组件
    -- plugins 第三方插件
    -- utils 工具函数库
        -- utils 工具函数    
    -- services 其他一些通用服务
    -- store vuex配置文件
        -- index.js
        -- actions.js
        -- getters.js
        -- mutations.js
    -- router 路由配置
    -- sass
        -- _variables.scss 全局变量，主题配置
        -- global.scss 应用级设置
    -- images 图片
-- packjson.json npm 依赖配置，
-- vue.config.js vue 额外配置
```

# 3 项目库依赖列表
除使用vue cli初始化vue项目的初始依赖外，其他依赖库如下：
```dependencies```
* `axios` http 请求库
* `echarts` 绘制图表的库
* `iview` UI 控件库
* `jsonp` jsonp请求库，由于axios不支持jsonp请求，需引用该库
* `ol` openlayer 地图库
* `wangeditor` 富文本编辑器
* `pdfjs-dist` pdf预览插件

```devDependencies```
* `node-sass` 配置使用scss
* `sass-loader` 配置使用scss

# 4 vue-router记录一二
构建单页面应用，通过匹配不同路由规则局部更新模版，规则->模版，参数传递，视图嵌套，导航控制，拦截守卫

## 4.1 路由文件拆分
初始开发时所有路由配置文件均写在同一个配置文件 `router/index.js` 下，随着模块的增加，配置文件变得臃肿，足足有上千行配置，难以查找维护，而且不便于多人协作。
因此按照模块划分了多个路由配置文件，在主文件中导入分模块配置数组，通过 `...` 展开合并到到主路由配置数组中。

## 4.2 路由组件懒加载以及分块打包
为了有更好的首页加载速度，路由组件使用了动态组件懒加载，具体就是使用一个 Promise 的工厂函数动态返回组件：
```javascript
{
    path: '/',
    component: ()  =>  import('@/components/App')
}
```
使用了路由懒加载后，各个组件将会打包成异步加载的单独文件，但是由于组件众多，所以按照模块划分把某个模块路由下的所有组件都打包在同个异步块 (chunk) 中，减少
文件数，同时兼顾了加载速度：
```javascript
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

## 4.3 利用路由导航守卫控制页面访问权限
前端需要根据权限控制页面、菜单、功能按钮的可见性，而一些用户需要鉴权访问的页面路径则需要在路由中进行处理。
在 `beforeEnter(to, from, next)` 中调用接口，返回一个Promise判断有无权限，如有权限则 `next()` 进入路由页面，如无权限则`next(new Error())`
抛出一个错误，在`router.onError(() => {})`回调中处理错误，提示非法访问。

## 4.4 路由组件传参
通过 `props` 给路由参数和组件解耦，在组件中通过 `props` 选项获取参数
* 布尔模式：设置为 true，route.params 将会被设置为组件属性
* 对象模式：如果 props 是一个对象，它会被按原样设置为组件属性。这种在参数静态不变情况下是有用的。
* 函数模式：创建一个函数返回 props。可以将参数转换成另一种类型，将静态值与基于路由的值结合等等。`props: (route) => ({ query: route.query.q })`

## 4.4 alias路由别名的使用
给路由的url设置别名，那么访问该别名ur也是有效的，按照这个路由匹配规则进行匹配访问

## 4.5 路由导航流程
* 导航被触发。
* 在失活的组件里调用 beforeRouteLeave 离开守卫。
* 调用全局的 beforeEach 守卫。`加载进度条`
* 在重用的组件里调用 beforeRouteUpdate。
* 在路由配置里调用 beforeEnter。`权限判断`
* 解析异步路由组件。
* 在被激活的组件里调用 beforeRouteEnter。`数据获取`
* 调用全局的 beforeResolve。
* 导航被确认。
* 调用全局的 afterEach 钩子。`隐藏进度条`
* 触发 DOM 更新。
* 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。`获取数据时截取组件实例，附加数据`
总结： 
全局 `beforeEach` `beforeResolve`  `afterEach`
组件 `beforeRouteLeave` `beforeRouteUpdate` `beforeRouteEnter`
配置 `beforeEnter`

# 5 vuex 使用记录一二
## 5.1 vuex 作用结构图：
``` 
                                -------->------- actions（动作） ---->----
                                |                                                                |
vue components ---                                                       mutations（变动）
                                |                                                                |
                                --------<------- state（数据存储）---<----
```
component -> actions : `store.dispatch('action')` 组件层派发动作，可以是异步操作，进而通过commit mutation改变 state `mapMutations({xxx (commit) {}})`
actions -> mutations : `store.commit('mutation', payload)` 同步变更 state 数据存储 `mapAction({xxx (dispatch) {}})`
state -> components : state 改变驱动渲染更新组件，`this.$store.state` `mapState({state => state.xxx})`

## 5.2 vuex 分模块
```javascript
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

# 6 axios 使用记录一二

`axios` 提供的功能有：

* `interceptors` 拦截器 未登录重定向，全局错误处理
```javascript
//添加请求拦截器
axios.interceptors.request.use(function (config) {
    //在发送请求之前做某事
    return config;
  }, function (error) {
    //请求错误时做些事
    return Promise.reject (error);
  });

//添加响应拦截器
axios.interceptors.response.use(function (response) {
    //对响应数据做些事
     return response;
  }, function (error) {
    //请求错误时做些事
    if (error.response.status == '401') { //未登录重定向值登录页面
        router.replace({path: '/login'});
    } else if (error.response.status == '403') {
        router.replace({path: '/login'});
    }
    return Promise.reject (error);
});
```

* `Cancellation` 取消请求 快速切换查询条件时
```javascript
const CancelToken = axios.CancelToken;
//生成一个请求标记源
const source = CancelToken.source();

axios.get('xxxx', {
  cancelToken: source.token
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // handle error
  }
});
// 通过请求标记源取消请求
source.cancel('Operation canceled by the user.');
```

* 全局配置
```javascript
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```

# 7 vue 的生命周期

* `beforeCreate` （创建前），在数据观测和初始化事件还未开始
* `created` （创建后），完成数据观测，属性和方法的运算，初始化事件， $el 属性还没有显示出来，this组件属性方法可见
* `beforeMount` （载入前），在挂载开始之前被调用，相关的render函数首次被调用。实例已完成以下的配置：编译模板，把data里面的数据和模板生成html。注意此时还没有挂载html到页面上
* `mounted` （载入后），在el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用。实例已完成以下的配置：用上面编译好的html内容替换el属性指向的DOM对象。完成模板中的html渲染到html页面中。此过程中进行ajax交互
* `beforeUpdate` （更新前），在数据更新之前调用，发生在虚拟DOM重新渲染和打补丁之前。可以在该钩子中进一步地更改状态，不会触发附加的重渲染过程
* `updated` （更新后），在由于数据更改导致的虚拟DOM重新渲染和打补丁之后调用。调用时，组件DOM已经更新，所以可以执行依赖于DOM的操作
* `beforeDestroy` （销毁前），在实例销毁之前调用。实例仍然完全可用
* `destroyed` （销毁后），在实例销毁之后调用。调用后，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用

# 8 vue 组件的通信

* 父组件传给子组件：子组件通过props方法接受数据
* 子组件传给父组件： $emit 方法传递参数
* `this.$listeners` 获取所有父组件传递的事件方法集合
* `this.$attributes` 获取除了 props 声明的其他自定义属性集合
* 非父子组件间的数据传递，兄弟组件传值，通过 eventBus 实例作为事件中心，用于传递和接收事件
```javascript
const bus = new Vue();

import bus from 'bus';
bus.$on('sendData', (data) => {
    console.log(data);
});

bus.$emit('sendData', data);
```

# 9 项目配置以及打包
```
npm run build
```
生成`static`目录，复制至`resources`目录下，访问 `/index.html`即可  

其他几点说明：
* 打包默认使用的是 `public/index.html` 作为入口模版文件
* 默认打包编译输出 dist 目录，而且静态资源文件引用的根路径相对于dist， 修改打包输出文件夹名称，vue.config.js 中配置：
```
outputDir: 'static'
```
* 默认输出文件是index.html，可修改打包输出文件名称，vue.config.js 中配置：
```
indexPath: 'app.html'
```
* 部署应用包时的基本 URL默认是根路径 `/`，即部署后访路径为 `http://xxx.xxx.xxx:xxx/index.html`，可 vue.config.js 中配置修改：
```
baseUrl: 'app'
```
则部署后访路径为  `http://xxx.xxx.xxx:xxx/app/index.html`

### 检验代码格式规范
```
npm run lint
```
