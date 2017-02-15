var fs = require('fs');

console.log('准备打开文件');
fs.stat('input.txt',(err,stats) => {
	if(err){
		console.error(err);
	}
	console.log(stats);
	console.log('读取文件成功');

	console.log('是否是文件：' + stats.isFile());
	console.log('是否是目录：' + stats.isDirectory());
});