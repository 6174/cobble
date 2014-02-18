#Professional Nodejs 
----
 作为spike本书的小记录 //--边看编写感觉更实在

##chapter 3 模块加载 
---
* 模块根据path或者name加载， 核心模块被预加载了的。
* module.exports是暴露对象 
* require一个folder的时候会首先查找package.json的main属性指向的文件， 或者加载index.js  
* 模块查找路径为， ./node_module， 如果没有则查找../node_module, 一直到root， 最后查找npm的全局路径下面的node_module
* require的模块在node中会被缓存， 多次require的模块其实是一个对象 

##chapter 4 Buffer 
---
* js的字符更适合用于html的处理但对于binary data会很浪费， Buffer对象则是处理binary data的利器 
* buffer的长度由我们指定， 单位为bytes， buffer的存储不是在javascript的vm里边的， 所以buffer不会被gc， buffer是保存在固存里边的。
* var buf = new Buffer('Iam a buffer'); 默认utf-8
* var buf = new Buffer('8b76fde713ce', 'base64'); buffer类型有uft-8, ascii, base64
* var buf = new Buffer(1024);//创建一个1024 bytes长度的buffer，内容为非0的随机buffer
* []操作符访问或者更改buffer的内容
* buf[10] = 257 -> buf[10]实际上会被赋值为0
* buf[10] = 100.7 -> buf[10]实际上会被赋值100
* buf[10000000] = 1 -> 超过了buffer的长度， 赋值会被忽略
* var smallerBuffer = buf.slice(1, 3); //slice操作并不会分配新的内存， 而且也不会有东西会被复制， 新的buffer只是在旧的buf上面建立一个开始结束的标记 
* buffer1.copy(buffer2, targetStart, sourceStart, sourceEnd); 将buffer1的sourceStart到sourceEndcopy到buffer2的targetStart位置。
* buf.toString("base64"); 

##chapter 5 Event Emitter
---
* var event = new (require('event').EventEmitter)();
* event 有emit, once, on, addListener, removeListener, removeAllListeners方法
* 继承 var util = require('util'); var MyClass = function() {}; util.inherits(MyClass, EventEmitter);

##chapter 6 Timer
---
* process.nextTick(function(){});  
* setInterval避免内部有IO耗时的方法， 此时通过setTimeout替换

##chapter 7 File
---
* 通过流的方式来处理file， 文件流和网络流的处理方式是统一的。 这样意味着不能读取文件的具体某个位置， 必须以完整连续的方式处理
* 三个file descriptors: standard input,  standard output, standard error 
* 标准输入是一个input-only stream，一个process读入console 或者由另外一个process pipe出来的数据。 
* 标准输出和标准错误是output-only stream, 一个process输出到console或者另外一个process 
* path模块来处理路径相关的工作， path.normalize, path.join, resolve, relative, dirname, basename, extname等方法 
* fs.stat('path', handler); 查看文件信息
* fs.open('path', 'flags', function(err, fileData){});
* fs.read(fileData, readBuffer, bufferOffset, bufferLength, filePosition, function(err, readedChunckBytesLength){});
* fs.read数据读入到readBuffer中，每次读入bufferLength的数据， 当readedChunkBytesLength为0表示已经读完 

##chapter 8 External Processes
---
* node是事件循环机制， 不适合cpu-intensive的程序， 为此需要一个子进程来处理这种类型的任务
* 一个最长用到child_process的情景是通过命令行调用外部程序
* require('child_process').exec('shell_command', options, function(err, stdout, stderr));
* var child = require('child_precess').spawn('node', ['spawn_child.js']); child.stdout.on('data', callback);
* spawn的process可以和父进程交互，child.kill(); child.stdin.write(data)可以向子进程写数据。

##chapter 9 Data Streams
---
* readable streams , writable streams, streams 是node为了处理IO异步的一个抽象，File, TCP socket都是stream。
* read_stream.on(data, function(data){}); 
* read_stream.setEncoding('utf-8');
* 流就像水龙头一样可以关掉stream.pause(), stream.resume()，但针对不同的情况pause所做的操作是不同的， 如file和socket不同。
* read_stream.on('end', function(){});
* write_stream.write(buffer);
* write_stream.wirte('I am a stream');
* write_stream.write('23asdf23sisd23', 'base64');
* write方法可能不能立即执行， 因为这要等待buffer为空的时候才能write， 只有等到write_stream触发drain事件的时候才是真正的写入数据 
* slow client problem: Node 在IO的时候不会阻塞， 这就意味着在做read或者write的时候不会阻塞， node会缓存数据如果数据没有立马写到buffer中，在下面的场景下， 重一个file read_stream里面将数据不断写入到tcp write_stream里边， read_stream不断触发data事件， 但是write无法写那么快， 这就导致node会不断缓存数据造成内存积压， 这个问题简而言之就是producer快于consumer， 解决这个问题的方法是为了让consumer跟上producer， 让producer稍微pause一会儿。 

* if(!write_stream.write(data)) { read_stream.pause()}; write_stream.on('drain', function(){ read_stream.resume()}); 
* read_stream.pipe(write_stream, {end: false});


##chapter 10 Building Tcp Server
---
* var server = require('net').createServer(function(socket){});
* socket.on('data/end/timeout/error...', function(data){});
* socket.setTimeout(60000);
* socket.setKeepAlive(true, [1000...]);
* socket.write(data);
* socket.setEncoding('utf-8');
* socket 即使一个read stream 也是一个write stream
* socket.pipe(write_stream); read_stream.pipe(socket);
* socket.end();
* server.on('listening/connection/close/error')

##chapter 11 build Http Server
---
* var server = require('http').createServer();
* server.on('request', function(req, res){ res.writeHead(200, {...}); res.write('hello world'); res.end()});
* server.listen(4000);
* req 为一个http.ServerRequest实例， req有url, method, headers等属性
* res 为一个http.ServerResponse实例， res.setHeader(...) res.removeHeader(...) res.write(...)
* Node的http有chunked encoding特性， 同fs.read方法一样， 在接收到的chunk长度为0的时候结束， header有个属性为Transfer-Encoding: chunked;  
* read_stream.pipe(res);
* 从child_process中pipe到res里边， var child = spawn('tail, ['-f', '/var/log/system.log']);  child.stdout.pipe(res); res.on('end', function(){child.kill()});
















