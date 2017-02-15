var fs = require('fs');

var data = 'hello world'
//写入流对象
var writeStream = fs.createWriteStream('output.txt');

//写入操作
writeStream.write(data,'utf8');

//绑定finish事件
writeStream.on('finish',() => {
	console.log('写入成功');
});

//绑定error事件
writeStream.on('error',(err) => {
	console.error(err);
});