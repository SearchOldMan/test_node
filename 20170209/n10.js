var fs = require('fs');

fs.readdir('../20170209',(err,files)=>{
	if(err){
		console.error(err);
	}

	files.forEach(function(file){
		console.log('filename is:'+file);
	});
});