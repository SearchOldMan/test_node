//引入模块
var events = require('events');
//创建eventEmitter对象
var eventEmitter = new events.EventEmitter();

//创建事件处理程序
var connectHandler = function connected(){
	console.log('连接成功');
	//触发事件
	eventEmitter.emit('data_received');
};
//绑定对象处理程序
eventEmitter.on('connection',connectHandler);

eventEmitter.on('data_received',function(){
	console.log('数据接收成功');

});

eventEmitter.emit('connection');

console.log('程序执行完毕');