##全局变量只有cobble方法   
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