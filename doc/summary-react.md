# 3 React 小记

* 使用 jsx 书写模版
```javascript
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

* 渲染模版
```javascript
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);
```
* props 传递属性和方法 子组件根据 props 输入渲染
```javascript
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}

function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}

function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

* 每个组件通过 state 存储数据状态，单向数据流，通过 setState 更新 state 从而驱动更新界面
```javascript
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

* 界面交互事件处理，通过 `onClick` `onChange` `onMousemove` 等直接绑定事件处理函数，事件处理函数通过 setState 异步批量更新 state，从而驱动界面更新。
```javascript
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

* 类组件和函数组件，如果仅仅是依赖输入属性 props 渲染模版，则可设计为函数组件，如果具有自身维持的状态组设计为类组件
* 状态提升，几个组件需要共享相同数据状态，建议将共享状态提升到它们最接近的共同父组件，即由父组件维护状态
* 组件生命周期
```javascript
class ExampleComponent extends React.Component {
    // 用于初始化 state
    constructor() {}
    // 用于替换 `componentWillReceiveProps` ，该函数会在初始化和 `update` 时被调用
    // 因为该函数是静态函数，所以取不到 `this`
    // 如果需要对比 `prevProps` 需要单独在 `state` 中维护
    static getDerivedStateFromProps(nextProps, prevState) {}
    // 判断是否需要更新组件，多用于组件性能优化
    shouldComponentUpdate(nextProps, nextState) {}
    // 组件挂载后调用
    // 可以在该函数中进行请求或者订阅
    componentDidMount() {}
    // 用于获得最新的 DOM 数据
    getSnapshotBeforeUpdate() {}
    // 组件即将销毁
    // 可以在此处移除订阅，定时器等等
    componentWillUnmount() {}
    // 组件销毁后调用
    componentDidUnMount() {}
    // 组件更新后调用
    componentDidUpdate() {}
    // 渲染组件函数
    render() {}
    // 以下函数不建议使用
    UNSAFE_componentWillMount() {}
    UNSAFE_componentWillUpdate(nextProps, nextState) {}
    UNSAFE_componentWillReceiveProps(nextProps) {}
}
```
对于异步渲染，现在渲染有两个阶段：reconciliation 和 commit 。前者过程是
可以打断的，后者不能暂停，会一直更新界面直到完成。
Reconciliation 阶段
• `componentWillMount`
• `componentWillReceiveProps`
• `shouldComponentUpdate`
• `componentWillUpdate`
Commit 阶段
• `componentDidMount`
• `componentDidUpdate`
• `componentWillUnmount`
因为 reconciliation 阶段是可以被打断的，所以 reconciliation 阶段会
执行的生命周期函数就可能会出现调用多次的情况，从而引起 Bug。所以对于
reconciliation 阶段调用的几个函数，除了 shouldComponentUpdate 以外，其他都应
该避免去使用
```生命周期图：```
```
getDefaultProps -> getInitalState -> componentWillMount -> render -> componentDidMount
props change -> componentWillReceiveProps -> shouldComponentUpate -> true -> componentWillUpdate -> render -> componentDidUpdate
                                                                                        |
state change ----------------------------------------------
umount -> componentWillMount
```


使用 react 做过几个学习项目，记录于此。
# 1 阅读书架应用
## 1.1 功能
* 分为书架主页(HomePage)和搜索页(SearchPage)
* `HomePage` 有 `Currently` `Reading` `Want to Read Read` 三个书架，书架上书籍可移动切换书架，支持批量移动
* `SearchPage` 可搜索在线书籍，可添加到主页任意一个书架上，且书籍状态与主页相同

## 1.2 组件设计
* 组件结构
`App` -> `HomePage` -> `BookShelf`
          -> `SearchPage` -> `BookShelf`

* 使用 React-router 拆分 `HomePage` 和 `SearchPage`，实现主页搜索页导航
* 状态设计 （`state`）
App 顶层组件存储 books 书架上所有书籍，通过`props`传递给  `HomePage` `SearchPage`;  
HomePage 中多选书籍时可通过 `props` 传递进来的回调函数更新书籍的选中状态，即更新 App 中的 books;  
SearchPage 中添加书籍时通过 `props.updateBooks` 更新 App 中的 books;  
HomePage 负责主页书架书籍移动的动作;  
SearchPage 负责搜索页搜索及往书架添加书籍的动作

## 1.3 代码细节
```javascript
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import HomePage from './Home'
import SearchPage from './Search'
import './App.css'

class BooksApp extends React.Component {
 
 //定义state数据状态
  state = {
  	books: []
  }

  componentDidMount() {
	    this.updateBooks()
  }

  updateBooks() {
    BooksAPI.getAll().then((data) => {           
        //获取书架列表，更新列表数据
        this.setState({
            books: Array.isArray(data) ? data : []
        })
    })
  }

  updateBookSelect(checked, bookId) {
        //更新选中的书本状态
        this.setState((prevState) => {
            let len = this.state.books.length;
            while (len--) {
                if (prevState.books[len].id === bookId) {
                    prevState.books[len].selected = checked;
                    return {
                        books: prevState.books
                    }
                }
            }
            
        })
    }

    render() {
        return (
            <Switch>
                <Route exact path='/' render={() => <HomePage updateBookSelect={this.updateBookSelect.bind(this)} books={this.state.books}/>}/>
                <Route path='/search' render={() => <SearchPage updateBooks={this.updateBooks.bind(this)} books={this.state.books}/>}/>
            </Switch>
        )
    }
}

export default BooksApp;
```
```javascript
import React from 'react'
import * as BooksAPI from './BooksAPI'
import { Link } from 'react-router-dom'
import BookShelf from './BookShelf'
import './App.css'

class HomePage extends React.Component {
    //通过构造函数继承父类props
    constructor(props) {
        super(props);
        //绑定事件到react组件上
        this.switchBookShelf = this.switchBookShelf.bind(this);
    }

    updateBookShelf() {
        BooksAPI.getAll().then((data) => {
            this.setState({
                books: data
            });
        })
    }

    switchBookShelf(book, event) {
        const that = this;
        if (book.shelf !== event.target.value) {
            console.log('switch shelf');
            BooksAPI.update({id: book.id}, event.target.value).then((res) => {
                console.log('update success')
                const booksState = res; 
                that.setState((prevState) => {
                    const books = this.props.books//prevState['books'];
                    const keys = ['currentlyReading', 'read', 'wantToRead'];
                    keys.forEach((key) => {
                        for (let i = 0, len = booksState[key].length; i < len; i++) {
                           for (let j =0, len1 = books.length; j < len1; j++) {
                                if (booksState[key][i] === books[j].id) {
                                    books[j].shelf = key;
                                    break;
                                }     
                            }
                        }
                    })
                    return {
                        books: books
                    }
                })
                
            })
        }
        
    }

    render() {
        const currentlyReadingBooks = this.props.books.filter((book) => {
            return book.shelf === 'currentlyReading';
        });
        const wantToReadBooks = this.props.books.filter((book) => {
            return book.shelf === 'wantToRead';
        });
        const readBooks = this.props.books.filter((book) => {
            return book.shelf === 'read';
        });
        return (
        <div className="list-books">
            <div className="list-books-title">
              <h1>我的书架</h1>
            </div>

            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">正在阅读</h2>
                  <BookShelf updateBookSelect={this.props.updateBookSelect} books={currentlyReadingBooks} moveToBookShelf={this.switchBookShelf}/>
                </div>

                <div className="bookshelf">
                  <h2 className="bookshelf-title">想要阅读</h2>
                  <BookShelf updateBookSelect={this.props.updateBookSelect} books={wantToReadBooks} moveToBookShelf={this.switchBookShelf}/>
                </div>

                <div className="bookshelf">
                  <h2 className="bookshelf-title">已阅读</h2>
                  <BookShelf updateBookSelect={this.props.updateBookSelect} books={readBooks} moveToBookShelf={this.switchBookShelf}/>
                </div>
              </div>
            </div>

            <div className="open-search">
                <Link to='/search'>Add a book</Link>
            </div>
          </div>
    )}
}

export default HomePage;
```

```javascript
import React from 'react'
import Select from './Select'
import './App.css'

class BookShelf extends React.Component {
    constructor(props) {
        super(props);       
        this.multiSelectInput = null;
        //获取输入元素input的输入值，需通过ref引用
        this.setMultiSelectInput = element => {
            this.multiSelectInput = element;
        }
    }

    state = {
        isMultiSelect: false,
        multiSelectValue: ''
    }

    updateMultiSelect(e) {
        this.setState({
            isMultiSelect: e.target.checked
        })
    }


    moveMultiBookToBookShelf(e) {
        this.setState({
            isMultiSelect: false
        },() => {
            this.multiSelectInput.checked = false
        })
        this.props.books.filter((book) => book.selected).forEach((book) => {
            //调用props传递进来的方法执行父组件中的方法
            this.props.moveToBookShelf({id: book.id}, e)
        })
    }

    render() {
        const books= this.props.books;
        const imgUrl = './icons/book.png';
        return (
            <div className="bookshelf-books">
                <i className="book-shelf-multiSelect">
                    <input ref={this.setMultiSelectInput} type="checkbox" value={this.state.isMultiSelect} onChange={(e) => this.updateMultiSelect(e)}/>&nbsp;<span>多选</span><br/>
                    {this.state.isMultiSelect &&
                    <div style={{ right: '-50px', top: '-3px' }} className="book-shelf-changer"><Select value={this.state.multiSelectValue} selectCallback={    (e) => this.moveMultiBookToBookShelf(e)}/></div>
                    }
                </i>
                <ol className="books-grid">
                    {
                    books.map((book, index) => {
                        return (
                            <li key={book.id}>
                                <div className="book">
                                    <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(` + (book.imageLinks ?          book.imageLinks.smallThumbnail : imgUrl) +`)` }}></div>
                                        
                                            {this.state.isMultiSelect ? <div className="book-shelf-selecter"><input type="checkbox" value={book.selected} onChange={(e) => this.props.updateBookSelect(e.target.checked, book.id)}/></div>
                                            : <div className="book-shelf-changer"><Select value={book.shelf} selectCallback={(e) => this.props.moveToBookShelf(book, e)}/></div> }
                                                
                                    </div>
                                    <div className="book-title">{book.title}</div>
                                    <div className="book-authors">{book.authors}</div>
                                </div>
                            </li>
                            )
                        })
                    }
                </ol>
            </div>
        )
    }
}

export default BookShelf
```

```javascript
import React from 'react'
import './App.css'

class Select extends React.Component {
    state = {
        value: this.props.value
    }

    handleChange(e) {
        this.props.selectCallback(e)
    }

    render() {
        return (
            <select onChange={(e) => this.props.selectCallback(e)} value={this.props.value}>
                <option value="none" disabled>Move to...</option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
              </select>
        )
    }
}

export default Select;
```

# 2 一个帖子内容发布评论的系统(React/Redux)

## 2.1 应用功能
* 浏览所有帖子目录
* 根据标签分类浏览帖子目录
* 帖子查看、编辑、创建、评分投票
* 查看、编辑、删除、投票评论

## 2.2 页面视图
* 主页：所有帖子
* 分类页：按标签分类帖子
* 帖子详情(包含评论)页面
* 帖子编辑页面

## 2.3 store 设计
* posts 帖子
* comments 评论
* categories 目录分类
* ranking 排名

## 2.4 项目文件结构
-- src
    -- actions
        -- index.js  定义可派发的动作
    -- reducers 更新渲染器，定义state数据，接收action变更state
        -- index
        -- categoryReducers.js
        -- commentReducers.js
        -- postReducers.js
        -- rankingReducers.js
    -- components    
    -- images
    -- API.js api接口
    -- helper.js 工具函数
    -- index.js 入口文件

## 2.5 代码细节
```javascript
//reducers index
import { combineReducers } from 'redux'
import post from './postReducers'
import comment from './commentReducers'
import category from './categoryReducers'
import ranking from './rankingReducers'


export default combineReducers({
  post,
  comment,
  category,
  ranking
})
```

```javascript
//recuders
import {
  GET_ALLPOSTS,
  GET_CATEGORYPOSTS,
  GET_POSTDETAIL,
} from '../actions'

const initialPostState = {
  allPosts: [],
  categoryPosts: [],
  postDetail: {}
}

function post (state = initialPostState, action) {
  const { allPosts, categoryPosts, postDetail } = action
  switch (action.type) {
    case GET_ALLPOSTS:
      //合并数据更新到state中
      return {
        ...state,
        allPosts: allPosts
      }
    case GET_CATEGORYPOSTS:
      return {
        ...state,
        categoryPosts: categoryPosts
      }
    case GET_POSTDETAIL: 
      return {
        ...state,
        postDetail: postDetail
      }
    default:
      return state
  }
}

export default post
```

```javascript
//actions
import * as API from '../API'
export const GET_ALLPOSTS = 'GET_ALLPOSTS'
export const GET_CATEGORYPOSTS = 'GET_CATEGORYPOSTS'
export const GET_POSTDETAIL = 'GET_POSTDETAIL'
export const GET_COMMENTS = 'GET_COMMENTS'
export const GET_CATEGORYS = 'GET_CATEGORYS'
export const CHNAGE_RANKING = 'CHNAGE_RANKING'
export const CHNAGE_COMMENT_RANKING = 'CHNAGE_COMMENT_RANKING'

function receiveCategorys(data) {
   return {
    type: GET_CATEGORYS,
    categories: data
  }
}

export function getCategories() {
  return function (dispatch) {
    return API.getCategories()
      .then(data => dispatch(receiveCategorys(data)) //接收到数据
      )
  }
}

export function changeRanking(ranking) {
   return {
    type: CHNAGE_RANKING,
    ranking: ranking
  }
}

export function changeCommentRanking(ranking) {
   return {
    type: CHNAGE_COMMENT_RANKING,
    commentRanking: ranking
  }
}

function receivePosts(data) {
  return {
    type: GET_ALLPOSTS,
    allPosts: data,
    receivedAt: Date.now()
  }
}

export function fetchAllPosts() {

  return function (dispatch) {
    //dispatch(requestPosts(subreddit)) 正在发起请求
    return API.getAllPosts()
      .then(data => data.map((item) => formatDate(item)))
      .then(data => data.filter((item) => !item.deleted))
      .then(data =>
        dispatch(receivePosts(data)) //接收到数据
      )
  }
}

function receivePostsByCategory(data) {
  return {
    type: GET_CATEGORYPOSTS,
    categoryPosts: data
  }
}

export function getPostsByCategory(category) {
  return function(dispatch) {
    return API.getPostsByCategory(category)
    .then(data => data.map((item) => formatDate(item)))
    .then(data => dispatch(receivePostsByCategory(data)))
  }
}

function receivePostDetail(data) {
  return {
    type: GET_POSTDETAIL,
    postDetail: data
  }
}

export function getPostDetail(id) {
  return function(dispatch) {
    return API.getPostDetail(id)
    .then((data) => formatDate(data))
    .then(data => dispatch(receivePostDetail(data)))
  }
}


export function upVotePost(post) {
  return function(dispatch) {
    return API.votePost(post.id, 'upVote')
    .then(data => dispatch(getPostDetail(post.id)))
    .then(() => {dispatch(fetchAllPosts());dispatch(getPostsByCategory(post.category))})
  }
}

export function downVotePost(post) {
  return function(dispatch) {
    return API.votePost(post.id, 'downVote')
    .then(data => dispatch(getPostDetail(post.id)))
    .then(() => {dispatch(fetchAllPosts());dispatch(getPostsByCategory(post.category))})
  }
}

export function addPost (post) {
  return function(dispatch) {
    return API.addPost(post)
    .then(data => {dispatch(fetchAllPosts());dispatch(getPostsByCategory(post.category))})
  }
}

export function updatePost (id, post) {
  return function(dispatch) {
    return API.updatePost(id, post)
    .then(data => dispatch(getPostDetail(id)))
    .then(data => {dispatch(fetchAllPosts());dispatch(getPostsByCategory(data.category))})
  }
}

export function deletePost (post) {
  return function(dispatch) {
    return API.deletePost(post.id)
    .then(data => {dispatch(fetchAllPosts());dispatch(getPostsByCategory(post.category))})
  }
}

export function upVoteComment(id, postId) {
  return function(dispatch) {
    return API.voteComment(id, 'upVote')
    .then(data => dispatch(getComments(postId)))
  }
}

export function downVoteComment(id, postId) {
  return function(dispatch) {
    return API.voteComment(id, 'downVote')
    .then(data => dispatch(getComments(postId)))
  }
}

function receiveComments (data) {
  return {
    type: GET_COMMENTS,
    comments: data
  }
}

export function getComments(id) {
  return function(dispatch) {
    return API.getComments(id)
    .then(data => data.map((item) => formatDate(item)))
    .then(data => dispatch(receiveComments(data)))
  }
}

export function addComment (comment) {
  return function(dispatch) {
    return API.addComment(comment)
    .then(data => dispatch(getComments(comment.parentId)))
  }
}

export function updateComment (postId, commentId, comment) {
  return function(dispatch) {
    return API.updateComment(commentId, comment)
    .then(data => dispatch(getComments(postId)))
  }
}

export function deleteComment (id, parentId) {
  return function(dispatch) {
    return API.deleteComment(id)
    .then(data => dispatch(getComments(parentId)))
  }
}


function formatDate(data) {
  if (data.timestamp) {
    const date = new Date(data.timestamp)
    data.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
  }
  return data
}
```

```javascript
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { getCategories, getPostsByCategory, fetchAllPosts, getPostDetail, addPost, updatePost } from '../actions'
import HomePage from './Home'
import PostCategory from './PostCategory'
import PostDetail from './PostDetail'
import PostEdit from './PostEdit' 
import NotFount from './share/NotFount'

class App extends Component {

  componentDidMount() {
    const { fetchAllPosts, getCategories } = this.props
    fetchAllPosts()
    getCategories()
  }

  render() {
    return (
        <BrowserRouter>
          <Switch>
              <Route exact path='/' render={(props) => <HomePage history={props.history} categorys={this.props.category.categories} posts={this.props.post.allPosts}/>} />
              <Route path='/:category/posts' render={(props) => <PostCategory match={props.match} goBack={props.history.goBack} getPosts={this.props.getPostsByCategory} posts={this.props.post.categoryPosts}/>} />
              <Route path='/posts/:id' render={(props) => <PostDetail match={props.match} history={props.history}/>}/>
              <Route path='/edit/:id' render={(props) => <PostEdit match={props.match} updatePost = {this.props.updatePost}
                 goBack={props.history.goBack} post={this.props.post.postDetail}  getDetail={this.props.getPostDetail}/>}/>
              <Route path='/add' render={(props) => <PostEdit match={props.match} addPost = {this.props.addPost}
                goBack={props.history.goBack} categorys={this.props.category.categories}/>}/>
              <Route path='/notfound' component={NotFount}/>
          </Switch>
        </BrowserRouter>
    )
  }
}

function mapStateToProps ({ post, category }) { // state = {post: {}, category: {}}
  return {
    post: post,
    category: category
  }
}

function mapDispatchToProps (dispatch) {  //注册派发action的事件
  return {
    getCategories: () => dispatch(getCategories()),
    getPostDetail: (id) => dispatch(getPostDetail(id)),
    addPost: (data) => dispatch(addPost(data)),
    updatePost: (id, data) => dispatch(updatePost(id, data)),
    fetchAllPosts: () => dispatch(fetchAllPosts()),
    getPostsByCategory: (category) => dispatch(getPostsByCategory(category))
  }
}

export default connect(
  mapStateToProps, //把state中的数据传递到props中
  mapDispatchToProps //把action可派发的动作事件传递到props中
)(App)
```
