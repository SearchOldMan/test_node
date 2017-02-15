var http = require('http');
var url = require('url');

//http请求处理函数
function start(route){
	function onRequest(request,response){
		var pathname = url.parse(request.url).pathname;

		response.writeHead(200,{'Content-Type':'text/plain'});
		response.write('hello world');
		response.end();
	}

	http.createServer(onRequest).listen(8888);
	console.log('http-server is started')
}

exports.start = start;
