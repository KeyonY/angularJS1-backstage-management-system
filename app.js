const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const fs = require('fs');
const url = require('url');

app.use(express.static(path.join(__dirname, 'public')));

var route = {
	'/':'/',
	'/json/WorksClass':'./public/json/WorksClass.json',
	'/json/AdminWorks':'./public/json/WorksClass-haveEdit=false&haveChecked=0&pageWidth=5&pageIndex=1.json',
}

//路由判断
var isValid = function(reqPath){
	for(var key in route){
		if (route[reqPath] != 'undefined'){
			return route[reqPath];
		}
	}
	return false;
}

app.listen(8012, () => {
  console.log('请打开浏览器（非IE）输入http://127.0.0.1:8012/Template/iframeAdmin.html')
})

var c = require('child_process');
c.exec("start http://127.0.0.1:8012/Template/iframeAdmin.html");

app.get('/json/*',function(req,res){
	// console.log(isValid(url.parse(req.url).pathname));
	if(!isValid(url.parse(req.url).pathname)){
		res.writeHead(404, {'Content-Type': 'text/plain;charset=utf-8'});
        res.write("{'errcode':404,'errmsg':'404 页面不见啦'}");
        res.end();
	}else{
		fs.readFile(isValid(url.parse(req.url).pathname),'utf8',function(err,data){
			res.send(data);
		})
	}
	
})
//登录验证
