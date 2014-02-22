 

function start() {
  return function haha(){}
}

var c = function (){}
var e = function d(){}

start(function(){});

// //--the test server
http.createServer(function(req, res) {
  res.write('s');
}).listen(5060);

