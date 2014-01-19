### 全局变量只有cobble方法   
---
* cobble函数传递测试对象， 对象包括  
    - 测试name  
    - 测试全局配置  
    - 测试的robot action方法
    - 测试spy方法， 监控函数的执行情况 
    - action结束过后的final方法， 用于观察函数的执行结果 
     
* cobble函数内会将传递的对象进行decorate包括 
    - robot对象， 检测robot的done方法， 如果执行结束， 那么就执行final方法    
    - spy对象， spy是一个函数但是拥有方法，每一个test suit应该拥有独立的spy对象， spy只监控在robot执行过程中触发的函数， spy是一个通过工厂create的函数对象， 全局的监控会在spy的存活期间将该spy watch的函数的执行情况告诉它。  
    - defer 对象， cobble只有执行完一个test suit 才会执行另外一个test suit， 当执行完final的时候， 才会执行defer.resolve(), 所以final方法会被包装   
* 为了让test suit按照队列方式的异步执行， 然而test suit的定义是分开的， 所以应该有一个动态的异步执行队列， 可以一直往队列里边添加task。  

* 为了让test的书写更加简洁， 可以对cobble action函数， spy函数， 以及final函数进行二次编译， 有些像wind.js的做法一样。  
 
*  cobble不应该仅仅针对有行为的方法测试， 也应该兼容传统的测试过程， 对于同步的非UI函数也应该测试和Assert， 这时候cobble应该提供更加简洁的接口    
```javascript 
    cobble('test suit name', function(){
        var add = myModule.add;
        assert.equal(add(1, 1), 2, '1 + 1 = 2');
    });  
```
这种方式类似Qunit的测试，jasmine太趋向于BDD， expect不适用于驱动开发 ， 所以也是通过assert进行测试specs的编写  


### spy的设计
---
* 对每一个testSuit，其实只是负责获取spy监控到的函数情报， 并对这些情报assert。 
* 函数监控其实是在其他地方已经完成了的， 这就是需要后台编译部分的原因， 直接将函数代码转为有spy语句的函数。
* spy也可以在任何其他地方手动调用， 可以spy一个函数， 或者一个对象。 
* IntelligenceAgency模块分为 intelligence， spy， intelligencer三个模块， 分别代表情报， 间谍， 情报员 
* 对于一个testSuit，需要一个情报员， 报告和监控已经被spy过后的函数情况， 这个情报员的在任时间为这个异步testSuit的执行时间， 这里就相当于一个pubsub模型，在任期间可以监听函数的情况， 非在任期间取消监听权限。     

### robot simulate设计  
---
* 准备使用jquery的simulate.js，simulate.js已经有了基本的鼠标事件和键盘事件， 但是接口还是不完善，需要在robot中重新实现接口。 其主要的方法都是针对鼠标键盘事件， 但是对于html事件需要另外触发   
* 对于htmlEvent事件大多数jquery都已经有了，select, change

### test spec
* qunit 方式没有test spec， 只是在equal， faild的时候添加说明， 类似spec， 但是
这种方式加大了测试脚本的负担， 为了编写大量额外的代码来运算， 再通过equal来确定是否相等  
* 而jasmine的方式是通过在it域内try catch获取expect的抛出的结果，如果出错， 那么抛出错误， jasmine捕获错误放到数组当中  
* expect.js 帮忙完成了错误的抛出并且做了错误信息的整理工作  
* 为此独立出来一个spec模块， 专门负责

### 想法 
* 在TDD开发当中， 是先写测试代码， 再写实现代码， 代码编写是一个由红变绿的过程， 那么对于cobble来说， 代码编写的步骤可以是：  
    1. 编写同步测试集， 用于驱动函数的开发，模块内的方法。  
    2. 编写包含spy的测试集， 用于驱动模块的开发， 这时候会有模块间的交互。 
    3. 编写包含robot的测试集， 用户驱动交互行为的开发。    
* cobble也要做到由红变绿的过程， 时刻捕捉错误。   
* 为了更加的统一， 都变为一个函数内实现， 而不用配置对象来书写测试集。  