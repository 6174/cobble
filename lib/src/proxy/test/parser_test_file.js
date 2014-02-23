 

function start() {
  return function haha(){
    return function(){
      return function inner(){
        return start(123, "sdf", function(){

        })
      }
    }
  }
}

function start2(){
  function innerStart(){
    
  }
}
function start3(){

}

var c = function (){}
var e = function d(){}
var f = 1 > 0 ? function test(){} : function (){}

start(function(){});

// //--the test server
http.createServer(function(req, res) {
  res.write('s');
}).listen(5060);

