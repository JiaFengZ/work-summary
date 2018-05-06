关于本文   
作为一名前端开发，总是要跟css打交道，发现要写出好的css代码真的不简单，标准无外乎就是简洁、易维护、扩展复用性好，但是肯定有其与众不同的地方，其中一个最大的挑战就是组织命名，找到一个有效有规律的命名方法论太重要了，否则给css命名就是恶梦！所以还是来看看怎么给css命名吧，除此之外，本文还总结了若干条规范建议。

## 1 BEM命名方法论
BEM命名方法论是我偶然阅读一篇文章([链接](https://segmentfault.com/a/1190000000391762))发现的。BEM 就是 block element modifier，可简称为 组织块-元素-修饰符，其命名规则如下：
* .block 抽象的组件容器
* .block-element 组件容器的后代
* .block-element-modifier 功能/语义描述（修饰符）
当然不是个命名都需要这3个部分，比如没有中间的后代元素，那么直接就是 .block-modifier 容器-修饰符。我们来看下面的例子：
```html
<div class="article">
  <div class="article-summary"></div>
  <div class="article-content">
      <p class="article-content-author">zjf</p>
      <p class="article-content-detail"></p>
      <p clss="article-content-copyright"></p>
  </div>
</div>
```
 `article`就是一个容器块，它有两个后代元素 `article-summary`和`article-content`，其中`article-content`下又有`author` `detail` `copyright`三个更具体的修饰符。    
 可看出这样的命名非常直观易于阅读理解，特别对于大型复杂的页面结构和团队多人协作的项目，`.block` 块还可以起到命名空间的作用，避免命名冲突/规则覆盖影响的问题，方便多人多模块开发。

 ## 2 一些常见的语义化命名
 BEM给我们提供了一个命名方法论，css命名就变得有迹可循，但这样还是不够，对于日常的页面开发，不难总结出一些普遍的组件结构，下面就列举出这些常见命名(很大一部分参考自这篇[文章](http://www.alloyteam.com/2011/10/css-on-team-naming/))：
 * 头 header
 * 内容 content/container
 * 尾 footer
 * 导航 nav
 * 左 中 右 left middle right
 * 侧边栏 sideBar
 * 菜单栏 menuBar
 * 子菜单 subMenu
 * 页面主题 main
 * 标志 logo
 * 搜索栏 searchBar
 * 版权 copyright
 * 标签页 tab
 * 提示信息 tips/msg
 * 标题 title
 * 摘要 summary
 * 按钮 btn
 * 当前的 current
 * 下载 download
 * 链接 link
 * 图标 icon
 * 列表 list
 * 表格 table

 ## 3 css的书写规范
 上面讨论了css命名，我觉得对于css书写规范来说一个好的命名占了50%，解决了命名犯难的问题，剩下50%就是一些其他的书写规范了。
 * 属性书写顺序  
 按照功能分组：布局/位置相关 → 盒子元素尺寸 → 文本相关 → 视觉效果  
布局/位置：position / top / right / bottom / left / float / display / overflow 
盒子元素尺寸: border / margin / padding / width / height
文本相关：font / line-height / text-align / word-wrap
视觉效果：background / color / transition / list-style
* rgb颜色值建议使用十六进制形式#rrggbb（字母小写），能够缩写的使用缩写，如 `#eee`
* 尽量少用id，一般使用class编写css规则
* 不要使用层级过深嵌套且匹配不精确的选择器，特别要避免类似 `classname div > div > div`的选择器 
* 能使用简写属性时使用简写属性
`margin: top right bottom left;`  `background: color image repeat attachment position;` `font: font-style (italic/normal) font-variant (small-caps) font-weight font-size/line-height font-family;`
* 长度为0时省略长度单位
`padding: 0` `width:0;height:0` `rotate(0)`
* 善用好选择器  
子选择器： >   
相邻选择器 +  
同胞选择器 ~
属性选择器 [attribute=value]  
伪类元素 :after :before  
几个孩子选择器：`:nth-child(n)` `:nth-of-type(n)` `:only-child` `:last-child` `:first-child`

 ## 4 工程化技巧
 * 为了移除不同浏览器的默认样式差异，需要编写 global.css 
 ```css
 /*global.css*/
 @charset "UTF-8";
* {
  vertical-align: baseline;
  font-weight: inherit;
  font-family: inherit;
  font-style: inherit;
  font-size: 100%;
  outline: 0;
  padding: 0;
  margin: 0; 
}

div {
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 14px;
  font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", Tahoma, "Hiragino Sans GB", STHeiti, "Microsoft YaHei";
  color: #666; 
}

ul,
ol {
  list-style: none; 
}

a {
  cursor: pointer; 
}

a img,
:link img,
:visited img {
  border: 0px; 
}

caption,
th {
  text-align: left; 
}

.fr {
  float: right; 
}

.fl {
  float: left; 
}

[ng\:cloak],
[ng-cloak],
[data-ng-cloak],
[x-ng-cloak],
.ng-cloak,
.x-ng-cloak,
.ng-hide:not(.ng-hide-animate) {
  display: none !important; 
}

ng\:form {
  display: block; 
}
input, 
select, 
textarea {
  padding-left: 3px;
  background-color: #fff;
  border: 1px solid #ddd;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
  -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s; }
  input:focus, select:focus, textarea:focus {
    border-color: #97c3fe;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(151, 195, 254, 0.6);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(151, 195, 254, 0.6); }

::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #999; 
}

:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #999; 
}

::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #999; 
}

:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #999; 
}

 ```
 *  对于字体、颜色、鼠标样式等颗粒型强的样式单独写到到一个common.css中
 ```css
 /*common.css*/
 .font12 { 
  font-size: 12px; 
}
 .font13 {
  font-size: 13px; 
}
 .font14 {
  font-size: 14px; 
}
 .font15 { 
  font-size: 15px; 
}
 .font16 {
  font-size: 16px; 
}
 .font17 {
  font-size: 17px; 
}
 .font18 {
 font-size: 18px; 
}
 .red {
  color: red;
}
.blue {
  color: blue
}
.float-right {
  float: right;
}
.float-left {
  float: left;
}
.cursor-pointer {
  cursor: ponter;
}
cursor-move {
  cursor: move;
}

 ```
