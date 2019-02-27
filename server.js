const express=require('express')
const expressStatic=require('express-static')
const multer=require('multer')
const fs=require('fs')
const pathLib=require('path')

var objMulter=multer({dest: './www/upload/'}) // 文件保存地址

var server=express()

server.use(objMulter.any()) // 可以接收任何文件，也可以用.single(’文件名发f1‘)

server.get('/', function (req, res) {
  console.log('query',req.query)
  res.send({ok: true, msg: 'get请求成功'})
})

server.post('/upload', function (req, res){
  console.log('body',req.body)
  res.send({ok: true, msg: 'post请求成功'})
})

server.post('/add', function (req, res){
  console.log('body',req.body)
  res.send({ok: true, msg: 'post请求成功'})
})

server.post('/token', function (req, res){
  console.log('body',req.body)
  // 给客户端一个标识
  res.set('token', 'abc')

  res.send({token: 'abc', msg: 'post请求成功'})
})

server.post('/uploadfile', function (req, res){
  console.log(req.files)
  //新文件名
  //'./www/upload/dfb33662df86c75cf4ea8197f9d419f9' + '.rar'

  var newName=req.files[0].path+pathLib.parse(req.files[0].originalname).ext

  fs.rename(req.files[0].path, newName, function (err){
    if(err)
      res.send('上传失败')
    else
      res.send('上传成功')
  })

  //1.获取原始文件扩展名
  //2.重命名临时文件
})

server.use(expressStatic('./www'))

server.listen(8888)