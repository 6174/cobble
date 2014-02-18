/**
 * cobble web proxy
 * @author: 6174
 */

//**********
//--requires
//**********
var http = require('http');
var https = require('https');
var net = require('net');
var request = require('request');
var connect = require('connect');
var httpProxy = require('http-proxy');
var child_process = require('child_process');
var path = require('path');
var util = require('util');

//--webProxy
var proxy = httpProxy.createProxyServer({});


//--server
// var server = require('http').createServer(function(req, res) {
//   // You can define here your custom logic to handle the request
//   // and then proxy the request.
//   proxy.web(req, res, { target: 'http://127.0.0.1:5060' });
// });

var app = connect()
  .use(connect.cookieParser())
  .use(connect.session({
    secret: 'cobble proxy secrect'
  }))
  .use(connect.bodyParser())
  .use(function(req, res) {
    proxy.web(req, res, {
      target: 'http://127.0.0.1:5060'
    });
  });

console.log("listening on port 5050")
http.createServer(app).listen(5050);

//--the proxy server
http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.write()
  res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(5060);