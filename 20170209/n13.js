var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer((request,response) => {
	var pathname = url.parse(request.url).pathname;

	console.log('request for' + pathname + 'received');

	//读取文件
	fs.readFile(pathname,(err,data) => {
		if(err){
			console.log(err);
			response.writeHead(404,{'Content-Type':'text/html'});
		}else{
			response.writeHead(200,{'Content-Type':'text/html;charset=utf8'});

			response.write(data.toString());
		}
		response.end();
	});
}).listen(8082);

console.log('http-server runnning at http://127.0.0.1:8082');