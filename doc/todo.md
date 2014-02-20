### 2014.1.1 - 2014.1.7 robot
* 这一周的主要任务是完成robot部分  
    * promise 模型实现  
    * click(dom), 实现点击代理  
    * domExist(dom)，untilDomExist(dom) 
    * wait(seconds)  
* 可能会做的工作   
    * 事件模拟分发  
    * 事件位置设置  
    * click(position)

### spy函数监控模型 
* spy 的细化工作
    * spy 提供spy工厂, 提供单独的

### 2014.1.16 - 2014.1.119 robot 完善  
* select(nodeId); 
* clickPoint(x, y); 
* mouseDown(x, y);  
* mouseMoveTo(x, y);
* mouseMoveBy(x, y);
* mouseUp(x, y)   
* 增加dom expect 包括结构属性和样式的assert 

### 2014.2.18 - 2014.2.22 proxy server
* 为了重新编译源文件， 方便spy调用， t需要做一个代理服务器， 代理访问应用中的脚本文件并做一定的加工再返回。  
* 重新复习professional nodejs， 熟悉http, https, ssl, child_precess  
* 完成代理访问服务器 
* 完成编译中间件   
* 设计： 
	- 目前参考spy-js的proxy设计 
	- 使用到的node模块有： 
   		`express`， `http-proxy`, `commander`  

### 2014.2.23-2014.2.24 
* 报道&选课   
* 想好基于 phantomJS 还是selenium的webdriver做更完善的设计  