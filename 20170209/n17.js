var express = require('express');
var fs = require('fs');
//创建express对象
var app = express();

app.use(express.static('/public'));

//查看用户列表
app.get('/list_users',(req,res) => {
	fs.readFile(__dirname + '/' + 'user.json','utf8',(err,data) => {
		if(err){
			console.log(err);
		}else{
			console.log(data);
			res.end(data);
		}
	});
});

//增加用户
var user = {
	"user4":{
		"name":"mohit",
		"password":"password",
		"profession":"teacher",
		"id":4
	}
};

app.get('/add_user',(req,res)=>{
	
	fs.readFile(__dirname + '/' + 'user.json','utf8',(err,data)=>{
		data = JSON.parse(data);
		data["user4"] = user["user4"];
		res.end(JSON.stringify(data));
	});
	
});

//过滤
app.get('/:id',(req,res)=>{
	fs.readFile(__dirname + '/' + 'user.json','utf8',(err,data)=>{
		data = JSON.parse(data);
		user = data['user' + req.params.id];
		console.log(user);
		res.end(JSON.stringify(user));
	});
});

var server = app.listen(8090, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

});