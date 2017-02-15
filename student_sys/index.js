var express = require('express');
var path = require('path');
var fs = require('fs');

var bodyParser = require('body-parser');
var Client = require('mysql');

/*//数据库名
test_database = 'nodejs_mysql_test';
//表名
test_table = 'test_student';*/

var client = Client.createConnection({
	host:'localhost',
	user:'root',
	password:'root',
	port:3306,
	database:'nodejs_mysql_test'
});

client.connect((err)=>{
	if(err){
		console.log('链接失败');
	}else{
		console.log('链接成功');
	}
});
/*client.query('create table test_student(id int(20) auto_increment primary key,name varchar(255),sex varchar(255),age int(30))',(err,data)=>{
	if(err){
		throw err;
	}else{
		console.log('创建表成功');
	}
});*/

//express对象
var app = express();
//静态文件
app.use(express.static(path.join(__dirname,'/public')));
app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine','ejs');

//登录模块  学校、教师、管理员
app.get('/',(request,response)=>{
	response.sendFile(__dirname + '/public/' + 'index.html');
	
});

app.post('/home',(request,response)=>{
	var name = '';
	var role = '';
	var isTrue = true;
	//如果是管理员
	if(request.body.admin && request.body.username && request.body.password){
		//管理员登录
		if(request.body.username == 'admin' && request.body.password == '123'){
			name = 'admin';
			role = '管理员';
		}else{
			role = '管理员';
			isTrue = false;
		}
		response.render('home_admin',{isTrue:isTrue,name:name,role:role});
		console.log(role,name);

	}else if(request.body.teacher && request.body.username && request.body.password){
		//如果是教师
		client.query('select * from user_list',(err,data)=>{
			//教师登录
			if(err){
				console.error(err);
			}else{
				for(var i=0;i<data.length;i++){
					if(request.body.username === data[i]['username'] && request.body.password === data[i]['password']){
						name = data[i]['username'];
						role = '教师'
						isTrue = true;
						break;
					}else{
						isTrue = !isTrue;
					}
				}
				response.render('home_admin',{isTrue:isTrue,name:name,role:role});
			}
			
			
		});
				
	}else if(request.body.student && request.body.username && request.body.password){
		//如果是学生
		client.query('select * from user_student_list',(err,data) => {
			if(err){
				console.log(err);
			}else{
				//保存用户名
				for(var i=0;i<data.length;i++){
					if(request.body.username == data[i]['username'] && request.body.password === data[i]['password']){
						name = data[i]['username'];
						role = '学生';
						isTrue = true;
						break;
					}else{
						isTrue = false;
					}
				}
				
				response.render('home_admin',{name:name,isTrue:isTrue,role:role});
			}
			
		});		
	}else{
		//如果什么都不是，就跳转到注册页面
		response.render('home_error');
	}
});

//点击注册跳转路径
app.get('/user_zhuce',(request,response)=>{
	response.render('home_error');
});

//注册的信息往数据表里面添加数据
app.post('/register',(request,response)=>{
	var new_name = request.body.new_name;
	var html = '<html><head><meta charset="utf-8"><title>注册成功</title><link rel="stylesheet" href="css/my.css"></head>' + 
		'<body>' + 
		'<h4>你好 &nbsp;' + new_name + '！欢迎您成为我们的一员' +
		'</h4>' + 
		'<a href="http://localhost:8890/">' + '点击前去登录' +
		'</a>' +
		'</body>' +
		'</html>';

	response.send(html);
});
	
console.log('app port at http://localhost:8890')
app.listen(8890);