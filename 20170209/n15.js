var express = require('express');
//创建express对象
var app = express();

//默认页面
app.get('/',(req,res) => {
	res.send('hello world');
});

//用户列表页面
app.get('/list_uers',(req,res) => {
	res.send('用户列表');
});
//post请求，也就是用户注册页面
app.post('/',(req,res) => {
	res.send('hello post');
});
//删除页面
app.get('/delete',(req,res) => {
	res.send('删除用户');
});
//正则匹配页面
app.get('/ab*cd',(req,res) => {
	res.send('正则匹配')
});

var server = app.listen('8081',function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log('address is %s:%s',host,port);
});