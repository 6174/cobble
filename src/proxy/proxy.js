/**
 * cobble web proxy
 * @author: 6174
 * 代理过程
 * -> 浏览器请求js文件
 * -> 浏览器代理请求到cobble proxy
 * -> 解析url
 * -> 如果不是js文件那么通过proxy.web访问
 * -> 如果是js文件， 那么通过request来请求
 * -> 将请求的js文件二次编译再返回
 */

//--required vars
var http = require('http');
var https = require('https');
var net = require('net');
var request = require('request');
var connect = require('connect');
var httpProxy = require('http-proxy');
var child_process = require('child_process');
var path = require('path');
var fs = require('fs');
var util = require('util');
var url = require('url');
var _ = require('underscore');

// var parser = require('parser');

//--user vars
var App, proxyAgent, middlewareConfig, server;

function start() {
  initProxyAgent();
  initMiddlewareConfig();
  initProxyServer();
  console.log("listening on port 5050")
  server.listen(5050);
}

function initProxyAgent() {
  proxyAgent = httpProxy.createProxyServer({});
  proxyAgent.on('proxyRes', function(res) {
    console.log('RAW Response from the target', JSON.stringify(res.headers, true, 2));
  });
}


function initMiddlewareConfig() {
  middlewareConfig = connect()
    .use(connect.cookieParser())
    .use(connect.session({
      secret: 'cobble proxy secrect'
    }))
    .use(connect.bodyParser())
    .use(getJsParserMiddleware());
}

function initProxyServer() {
  server = http.createServer(middlewareConfig);
  //--处理各种错误
  process.on('uncaughtException', function(err) {
    console.log("\nError!!!!");
    console.log(err);
  });
}



function getJsParserMiddleware() {
  return function(req, res, next) {
    var reg = /.js$/gi;

    var parsedUrl;
    if(req.originalUrl.indexOf(req.headers.host) >= 0){
      parsedUrl = req.parsedUrl = url.parse(req.originalUrl);
    }else{
      parsedUrl = req.parsedUrl = url.parse('http:' + req.headers.host + req.originalUrl);
    }

    if (reg.test(parsedUrl.pathname) > 0) {
      requestJsFile(req, res);
    } else {
      handleProxy(req, res);
    }
  }
}

function handleProxy(req, res) {
  proxyAgent.web(req, res, {
    target: req.parsedUrl.href //'http://localhost:5060'
  }); //});
}


function requestJsFile(req, res) {
  request(req.parsedUrl.href, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var body = body;
      res.write(body);
    }
    res.end();
  });
}

function parseReqUrl(req) {
  var host = req.headers.host;
  return url.parse(req.url);
}

function setJsHeaders(res) {
  res.set("Content-Type", "text/javascript"),
  res.set("Cache-Control", "no-cache, no-store, must-revalidate"),
  res.set("Pragma", "no-cache"),
  res.set("Expires", "0");
}


start();

///////////////////////////////////////////////////////////////////////////////////////////////
//--the test server
http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.write('request successfully proxied to: ' + req.url + '\n' + util.inspect(req.headers));
  res.end();
}).listen(5060);