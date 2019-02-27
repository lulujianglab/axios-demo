在前端这个迅猛发展的领域，前端请求方法也是迭出不穷，从原生 `XHR `到 `jQuery ajax`，再到现在的 `axios` 和 `fetch`

在分析 `axios` 方法之前，我们先来看看 `jQuery ajax` 和 `fetch` 方法

## jQuery ajax

`jQuery ajax` 是对原生 `XHR` 的封装，还支持 `JSONP`

```js
$.ajax({
  type: 'POST',
  url: url,
  data: data,
  dataType: dataType,
  success: function() {},
  error: function() {}
})
```

但是随着 `react`，`vue` 等前端框架的兴起，`jQuery` 早已不复当年之勇

且 `jQuery` 整个项目太大，单纯使用 `ajax` 却要引入整个 `JQuery` 非常的不合理，于是便有了 `fetch` 的解决方案

## fetch

`fetch` 号称是 `ajax` 的替代品，它的 `API` 是基于 `Promise` 设计的

```js
// 原生XHR
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText) // 从服务器获取数据
    }
}
xhr.send()

// fetch
fetch(url).then(response = > {
    if (response.ok) {
        response.json()
    }
}).then(data = > console.log(data)).
catch (err = > console.log(err))
```

再搭配上 `async` / `await` 将会让我们的异步代码更加优雅

```js
async function test() {
  let response = await fetch(url);
  let data = await response.json();
  console.log(data)
}
```

`fetch` 相对于是更加底层的，很多情况下都需要我们再次封装，比如需要手动将参数拼接成 'name=test' 的格式，而 `jquery ajax` 已经封装好了

```js
// jquery ajax
$.post(url, {name: 'test'})
// fetch
fetch(url, {
  method: 'POST',
  body: Object.keys({name: 'test'}).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&')
})
```

除此之外，`fetch` 还有很多问题，比如

* `fetch` 只对网络请求报错，对 400，500 都当做成功的请求，需要封装去处理

* `fetch` 默认不会带 `cookie`，需要添加配置项

* `fetch` 不支持 `abort`，不支持超时控制，使用 `setTimeout` 及 `Promise.reject` 的实现的超时控制并不能阻止请求过程继续在后台运行，造成了流量的浪费

* `fetch` 没有办法原生监测请求的进度，而 `XHR` 可以

具体问题可以参考 [fetch 没有你想象的那么美](http://undefinedblog.com/window-fetch-is-not-as-good-as-you-imagined/?utm_source=caibaojian.com) 和 [fetch 使用的常见问题及解决方法](https://www.cnblogs.com/huilixieqi/p/6494380.html)所以fetch并不是开箱即用的

## axios

对比于 `jQuery ajax` 、 `fetch` , `axios` 的优点简直不要太多，它也是 `vue` 官网推荐使用的

`axios` 是一个基于 `Promise` 的 `HTTP` 库，可以用于浏览器和 `nodejs` 中，主要特性有

> 从浏览器中创建 `XMLHttpRequest`
> 从 `node.js` 创建 `http` 请求
> 支持 `Promise API`
> 拦截请求和响应
> 转换请求数据和响应数据
> 取消请求
> 自动转换 `JSON` 数据
> 客户端支持防御 `XSRF`

`axios` 本质上也是对原生 `XHR` 的封装

```js
axios.post('/upload', {
  userName: 'zhangsan'
})
.then(res => {
  console.log(res,res.data)
})
.catch(err => {
  console.log(err)
})
```

对于客户端支持防御 XSRF，实际上就是让你的每个请求都带一个从 `cookie` 中拿到的 `key`，根据浏览器同源策略，假冒的网站是拿不到你 `cookie` 中的 `key`，这样后台就可以轻松辨别出这个请求是否是用户在假冒网站上的误导输入，从而采取正确的策略

`axios` 既提供了并发的封装方法，也没有 `fetch` 的各种问题，而且体积也较小，当之无愧现在最应该选用的请求的方式

具体的使用方法我们可以查看 [axios 中文文档](http://www.axios-js.com/zh-cn/docs/index.html)

下面是一些封装方法的详细使用

### 合并请求

```js
let q1 = axios.post('/add','b=2')
let q2 = axios.post('/upload','a=1')

// 合并这两个请求，并处理其成功和失败
// 一般会用于两个分开的相关联的请求，缺一不可
axios.all([q1,q2])
.then(axios.spread((res1,res2) => {
  // 全成功
  console.log(res1,res2)
}))
.catch(err => {
  // 其一失败
  console.log(err)
})
```

### options 参数

```js
// axios.headers = {} // 覆盖原本默认头
// axios.defalut.headers.accept = 'abc' // 走默认头，修改个例
            
// 请求一
axios.get('/',{
  params: {id:1},

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: (data) => {
    console.log(data)

    // 就是res.data,可以更改
    data = 'data changed'

    return data
  }
})
.then(res => {
  console.log(res,res.data)
})
.catch(err => {
  console.log(err)
})

// 请求二
axios.post('/upload', 'name=jack', {
  timeout: 1000,

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  transformRequest: (data) => {
    // 加工请求体数据
    return 'name=rose'
  }
})
.then(res => {
  console.log(res,res.data)
})
.catch(err => {
  console.log(err)
})
```

### 取消请求

这里我们以上传文件为例，在 vuejs 中使用

```html
choose file : <input type="file" name="file" @change="changeFile" />
<button @click="sendAjax">sendReq</button>
<button @click="cancelAjax">cancelReq</button>
<button @click="resumeAjax">ContinueSendlReq</button>
```

```js

// 发送请求
sendAjax() {

  // 在请求前需要先生成独立的标识，才能更方便取消请求
  const CancelToken = axios.CancelToken // 获取取消标识
  const source = CancelToken.source() // 使用 CancelToken.source 工厂方法创建 cancel token
  // 保存起来方便取消调用
  this.source = source
            
  let fd = new FormData()
  fd.append('file',this.file)
  axios.post('/uploadfile',fd,{
    // 携带取消标识
    cancelToken: source.token,
    onUploadProgress: (progressEvent) => {
      console.log(progressEvent.loaded)
      console.log(progressEvent.total)

      // 保存最后上传大小
      this.loaded = progressEvent.loaded

      this.rate = (progressEvent.loaded / progressEvent.total)*100
    }
  })
  .then(res => {
    console.log(res.data)
  })
  .catch(err => {
    console.log(err)
  })
},

// 取消请求
cancelAjax() {
  this.source.cancel() // 通过内部存好的方法做取消
},

// 继续请求
resumeAjax() {
  // 剪裁文件        开始        结尾
  const fileData = this.file.slice(this.loaded+1,this.file.size)
  let fd = new FormData()
  fd.append('file',fileData)

  // 为了后续续传以后，再取消
  const CancelToken = axios.CancelToken // 获取取消标识
  const source = CancelToken.source() // 使用 CancelToken.source 工厂方法创建 cancel token
  this.source = source

  axios.post('/uploadfile',fd,{
    // 携带取消标识
    cancelToken: source.token,
    onUploadProgress: (progressEvent) => {
      // 保存最后上传大小
      this.loaded = progressEvent.loaded
      this.rate = (progressEvent.loaded / progressEvent.total)*100
    }
  })
  .then(res => {
    console.log(res.data)
  })
  .catch(err => {
    console.log(err)
  })
},

// 上传文件
changeFile(e) {
  // console.log(e.target.files[0])
  this.file = e.target.files[0]
}
```

为了更方便的取消请求，我们在发送请求时，需要有独立的标识

取消请求大概来说分为三步

1. 获取请求标识 
2. 使用 `CancelToken.source` 工厂方法创建 `cancel` `token`，保存起来方便取消调用 
3. 通过内部存好的方法做取消

### 拦截器

**在请求或响应被 `then` 或 `catch` 处理前拦截它们**

比如实现一个功能如下

1. 在请求发起之前，show 一个 loading 出来
2. 响应回来之后，关闭这个 loading

可以通过设置一个标识表示 loading 出现与否，默认是不出现，在在发送请求之前将 loading 标识设为 true，拿到响应数据之后，将 loading 标识设为 false

```js
data() {
  return {
    isshow: false // loading默认不出现
  }
},
```

添加请求拦截器

```js
// 配置请求拦截器  use给请求之前做的事可以是多件，可以use多次
axios.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  console.log(config)

  this.isshow = true // loading 出现
  return config
}, (error) => {
  return Promise.reject(error)
})
```

添加响应拦截器

```js
 axios.interceptors.response.use((res) => {
  // 对响应数据做点什么
  console.log(res) // res.config
  
  this.isshow = false // loading 消失
  return res
}, (error) => {
  return Promise.reject(error)
})
```

在拦截器中我们也可以实现一个类似 cookie 的机制

1. 服务器发送 cookie 到客户端保存起来，在响应拦截器中完成
2. 然后在请求之前，从本地获取 cookie，设置请求头拦截器

在服务端代码中设置响应头中包含 `token: 'abc'` 的信息

```js
server.post('/token', function (req, res){
  console.log('body',req.body)
  // 给客户端一个标识
  res.set('token', 'abc')

  res.send({token: 'abc', msg: 'post请求成功'})
})
```

然后前端请求数据，通过响应拦截器将 token 存在本地，使用 `localStorage`

```js
axios.interceptors.response.use((res) => {
              
  // 获取服务器的响应头
  if(res.headers.token) {
    var token = res.headers.token
    localStorage.setItem('token',token)
  }
  
  return res
}, (error) => {
  return Promise.reject(error)
})
```

然后再次发送请求时，通过请求拦截器从本地取出 token 放入请求头中

```js
axios.interceptors.request.use((config) => {

  // 设置请求头，类似cookie
  var token = localStorage.getItem('token')
  if(token) {
    config.headers['token'] = token
  }

  return config
}, (error) => {
  return Promise.reject(error)
})
```

其他的方法使用这里就不做过多赘述了，具体的使用可以查看 [axios 中文文档](http://www.axios-js.com/zh-cn/docs/index.html#axios-post-url-data-config)

上述用到的所有代码完整版可以查看 []()