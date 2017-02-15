var express = require('express');
//创建express对象
var app = express();

app.get('/',(req,res) => {
	res.send('hello world');
});

var server = app.listen('8081',function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log('address is %s:%s',host,port);
});