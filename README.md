# 1.概述
## 1.1 React 与 Redux 的关系
* react 与 redux 是没有关系的，redux 支持 react, angular, jQuery, 甚至是javascript
* Redux 与 React 这类库搭配起来更好用
## 1.2 React-redux
* react-redux 就是 Redux 官方出的用于配合 React 的绑定库
* react-redux 能够使你的 React 组件从 Redux store 中很方便的读取数据， 并且向 store 中分发 actions 更新数据
## 1.3 React-Redux 中两个重要的成员
* Provider 这个组件能够使你整个app都能获取到store中的数据
    * Provider 包裹在跟组件的最外层，使所有的子组件都可以拿到 state
    * Provider 接收 store 作为 props，然后通过 context 往下传递，这样react中任何组件都可以通过 context 获取到 store
    * 解决了容器组件可能存在很深的层级，防止一层一层去传递state
* connect 这个方法能够使组件跟 store 来进行关联
    * Provider 内部组件如果想要使用到 state 中的数据，就必须要 connect 进行一层包裹封装（必须要被 connect 进行加强）
    * connect 就是方便我们组件能够获取到 store 中的state
# 2. React-Redux 基本使用
## 2.1 前期准备
### 2.1.1 使用create-react-app脚手架生成项目
``` npx create-react-app count-demo ```
### 2.2.2 删除无用组件，修改项目结构&配置

![](https://user-gold-cdn.xitu.io/2020/5/22/1723b0ee5e5e407f?w=792&h=850&f=png&s=230363)
## 2.2 安装 react-redux 
* react-redux 不是 react 官方所提供，所以当我们构建 react 项目之后， 需要进行安装<br />
```
yarn add react-redux
npm install react-redux --save
```
* react-redux 还需要依赖于 Redux 中的 store，所以我们还需要安装 redux
```
yarn add redux
npm install redux --save
```
## 2.3 利用 redux 来构建 store
* 创建 reducer/index.js 文件，构建 reducer 来响应actions
```
// reducer/index.js
/**
*@desc 纯函数，接收两个参数
*@paream state
*@paream action
/

export const reducer = (state, action)=> {
    return state
}
```
* 创建 store/index.js 文件，通过createStore方法，把我们的reducer传入进来
```
// store/index.js
import { createStore } from 'redux'
import { reducer } from '../reducer'

const store = createStore(reducer)
export default store
```
* 在app.js中引入 store
```
// app.js
import React from 'react'
import "./App.css"
// 导入我们的store
function App() {
    return <div className="App"><div/>
}
```
## 2.4构建页面
* 实现一个可以处理加减的计数器，页面如下图所示

![](https://user-gold-cdn.xitu.io/2020/5/22/1723b14280e139b0?w=498&h=160&f=png&s=6960)
* 创建一个组件，名字叫CountButton，里面放两个 button 按钮
```
// components/CountButton.jsx
import React from 'react'

export default function CountButton() {
  return (
    <button> +10 </button>
    <button> -2 </button>
  )
}
```
* 创建另外一个组件，名字教 CountNum，里面放一个 div，用来现实数字
```
// components/CountNum.jsx
import React from 'react'

export default function CountNum(props) {
  return (
    <div>0</div>
  )
}
```
* 在 app.js 中引入两个组件
```
// app.js
import React from 'react';
import './App.css';

import store from './react-redux/store'
import CountButton from './components/CountButton'
import CountNum from './components/CountNum'
function App() {
  return (
    <div className="App">
      <CountButton />
      <CountNum />
    </div>
  );
}

export default App;
```
## 2.5 action 和 reducer 改造
* action 创建函数
    * Action 是把数据从应用传到 store 的有效载荷; 它是 store 数据的唯一来源。
    * Action 本质上是 JavaScript 普通对象。我们约定，action 内必须使用一个字符串类型的 type 字段来表示将要执行的动作
    * Action 创建函数 就是生成 action 的方法
```
// actions/index.js
export const addAction = (num)=> {
  return {
    type: 'ADD_NUM',
    payload: {
      num
    }
  }
}

export const reduceAction=(num)=> {
  return {
    type: 'REDUCE_NUM',
    payload: {
      num
    }
  }
}
```
* 我们的组件具有增加和减少两个功能，所以 reducer 需要根据不同的 action type 来处理不同的场景；
    * reducer 指定了应用状态的变化如何响应 actions 并发送到 store 的
    * reducer 就是一个纯函数，接收旧的 state 和 action，返回新的 state。
    * 保持 reducer 纯净非常重要。永远不要在 reducer 里做这些操作：
        * 修改传入参数；
        * 执行有副作用的操作，如 API 请求和路由跳转；
        * 调用非纯函数，如 Date.now() 或 Math.random()。
### 注意:
不要修改 state。 使用 Object.assign() 新建了一个副本。不能这样使用 Object.assign(state, { visibilityFilter: action.filter })，因为它会改变第一个参数的值。你必须把第一个参数设置为空对象。你也可以开启对 ES7 提案对象展开运算符的支持, 从而使用 { ...state, ...newState } 达到相同的目的。
在 default 情况下返回旧的 state。遇到未知的 action 时，一定要返回旧的 state。
```
// reducer/index.js
const initialState = {
  count: 0
}
export const reducer = (state = initialState, action)=> {
  switch (action.type) {
    case 'ADD_NUM':
      return {
        ...state,
        count: state.count + action.payload.num
      }
    case 'REDUCE_NUM':
      return {
        ...state,
        count: state.count - action.payload.num
      }
    default:
      return state
  }
}
```
## 2.6 引入 Provider 组件
* 在 app.js 中导入 Provider 组件
```
import { Provider } from 'react-redux'
```
* 利用 Provider 组件将我们整个结构进行包裹
* 给 Provider 组件设置 store 的属性，这个值就是通过 createStore 构建出来的 store 实例对象
```
function App() {
  return (
    <Provider store={ store }>
      <div className="App">
        <CountButton />
        <CountNum />
      </div>
    </Provider>
  );
}
```
## 2.7 connect 使用
* 导入 connect 方法
```
import { conenct } from 'react-redux'
```
* 调用 connect 方法
```
connect(...)(Component)
```
### connect 参数说明
| 参数名 | 类型 | 说明 |
|------|------------|------------|
| mapStateToProps(state, ownProps)  | Function         | 1. 这个函数允许我们将 store 中的数据作为props绑定到组件上;2.state: redux 中的 store; 3.ownProps: 自己的props;      |
| mapDispatchToProps(dispatch, ownProps)  | Function        |1.将 action 作为 props 绑定到我们自己的函数中；2.dispatch: 就是 store.dispatch()3.ownProps: 自己的props;3. 必须有返回值，为Object 类型        |
| mergeProps(stateProps, dispatchProps, ownProps) | Function       | 不管是 stateProps 还是 dispatchProps, 都需要和 ownProps merge之后才会被赋给我们的组件，通常情况下，可以不传这个参数，connect 就会使用 Object.assign 替代改方法       |
| options | Function       | 可以定制 connector 的行为       |

*   利用 connect 方法让我们组件与 store 关联
    * 在组件 CountButton 和 CountNum 中分别导入 connect 方法
    * 利用 connect 方法来对我们的组件进行加强，并且导出
    * 组件 CountButton 属于发送方，所以要实现第二个参数
    * 组件 CountNum 属于接收方，所以要实现第一个参数
## 2.8 组件实现
### 2.8.1 CountButton  发送 action
* 导入 connect
* 利用 connect 对组件进行加强：connect(要接受数组的函数，要发送action的函数)(放入要加强的组件)
* 需要实现第二个参数
    构建函数 mapDispatchToProps(dispatch) ;	dispatch就是用来发送 action的
* 在组件的内部就可以通过 props 来调用这个方法
```
// CountButton.jsx
import React from 'react'
import { connect } from 'react-redux'
import { addAction, reduceAction } from '../react-redux/actions'

function CountButton(props) {
  const addTen = ()=> {
    props.sendAdd(10)
  }
  const reduceTwo =()=> {
    props.sendReduce(2)
  }
  return (
    <>
      <button onClick={addTen}> +10</button>
      <button onClick={reduceTwo}> -2 </button>
    </>
  )
}
const mapDispatchToProps = dispatch=> {
  return {
    // dispatch 一个 addAction
    sendAdd: (num)=> {
      dispatch(addAction(num))
    },
     // dispatch 一个 reduceAction
    sendReduce: (num)=> {
      dispatch(reduceAction(num))
    }
  }
}

export default connect(null, mapDispatchToProps)(CountButton)
```

### 2.8.2 CountNum  接收 state
* 导入 connect 方法
* 利用 connect 对组件进行加强
* CountNum 属于接收方，就需要实现 connect 的第一个参数
mapStateToProps 里面的参数就是我们关心的state，把这个 state 进行return 才能再组件的内部获取到最新的数据；
CountNum 是否能拿到数据的关键在于 reducer , 只有 reducer 里面返回了新的 state 时才能被获取到
```
import React from 'react'
import { connect } from 'react-redux'
function CountNum(props) {
  return (
    <div>{props.count}</div>
  )
}
const mapStateToProps = state => {
  return state
}
export default connect(mapStateToProps)(CountNum)
```