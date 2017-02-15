var express = require('express');
//express对象
var app = express();

//静态文件路径
app.use(express.static('public'));

//路由配置
app.get('/index.html',(req,res) => {
	res.sendFile(__dirname + '/' + 'index.html');
});

app.get('/process_get',(req,res) => {
	//json格式
	var response = {
		first_name:req.query.first_name,
		last_name:req.query.last_name 
	};

	console.log(response);
	res.end(JSON.stringify(response));

});


//监听
var server = app.listen('8083',function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log('应用实例的地址在http://%s:%s',host,port);
});