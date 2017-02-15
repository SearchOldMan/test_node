var fs = require('fs');

var buf = new Buffer(1024);

//打开文件
console.log('准备打开文件');

fs.open('input.txt','r+',(err,fd) => {
	if(err){
		console.error(err);
	}
	console.log('打开文件完成');

	//读取文件
	fs.read(fd,buf,buf.length,0,function(err,bytes){
		if(err){
			console.log(err);
		}
		if(bytes > 0){
			console.log(buf.slice(0,bytes).toString());
		}
	});

	fs.close(fd,(err)=>{
		if(err){
			console.log(err);
		}
		console.log('文件关闭')
	});
});