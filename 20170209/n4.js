var fs = require('fs');

var data = '';

var readStream = fs.createReadStream('input.txt');

//设置编码
readStream.setEncoding('utf8');

//绑定data事件
readStream.on('data',(chunk) => {
	data += chunk;
});

//绑定end事件
readStream.on('end',() => {
	console.log(data);
});

//绑定error事件
readStream.on('error',(err) => {
	console.error(err);
});

console.log('程序执行结束');