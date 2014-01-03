##Cobble
----
###一个专注于前端交互的测试框架

###介绍  
   
* 写这个框架的目的在于我深知TDD的power， 但是对于一个前端从业人员来说， 在真正的项目开发过程当中很难应用这种能力. 
特别是在facebook， 阿里， 腾讯这样的大公司在实际前端开发过程中也没用完全应用TDD的能力， 只是部分的框架代码会用到TDD。 
* jasmine， mocha这些xunit的类测试更适用于node环境的业务逻辑数据处理相关的代，然而对于前端开发来说， 更像ATDD,  或者更恰当的说是界于TDD和ATDD之间，交互和逻辑永远是结合在一起的。 如果按照TDD的测试精神， 编写测试应该执行的更快， 
测试脚本的编写不应该花很多时间， 测试脚本是为了驱动编写实际逻辑的意向变成方法。 
* selenuim能够进行前端的测试，应该算在是ATDD里边，ATDD不能驱动我们编写实际业务代码，因为为了完成ATDD的机会成本是很大的， 
我们更愿意花更多的时间在业务逻辑代码编写上面， 而把ATDD以及相关的测试脚本交给测试人员。  
* cobble的目的就是为了实现一个非xunit标准的结余ATDD和TDD的以驱动逻辑代码编写为目的的测试框架。  


###设计 

* 目前我的想法是将cobble分为以下几个部分  
    - 一个前端robot， 用于模拟用户行为  
    - 测试describe部分  
    - spy， 监控标记函数的执行
    - expect 部分， 使用expect.js
    - dom expect, 针对html的expect，dom结构属性样式
* 测试的单位是最基本的函数单元， 验证的对象包括
    - 参数
    - 执行结果
    - 执行顺序
    - 执行与否
    - 错误异常   
* 测试代码编写为两部分  
    - 测试case的编写  
    - 函数标记， 通过注释方式  
* 解析， 写一个服务编译注释脚本， 返回编译过的脚本用于spy监控  

##使用  
* 期望的结果， 下面是一个简单的login使用sample 
```
     */
    cobble({ 
        //--一些配置参数
        name: "user login",
        printCallStack: true,

        //--mock 的用户行为， 目前在test/testRobot.html下面已经可以看到使用场景了, 使用promise A+模型极大的简化了异步行为的编写， 目前只有简单的click input wait方法 
        action: function() {
            return robot()
                .input('#UserName', '6174')
                .wait(1)
                .input('#Password', '131420')
                .wait(1)
                .click('#Login')
                .wait(1)
                .done();
        },
        //--对模拟过程中的函数进行观察， 并通过callShot可以查看
         函数调用的参数， 结果， 时间， 上下文情况，
        watch: function() {
                //--对函数调用的观察
                watch('OnFillUserName', function(callShot) {
                    // assertStuff;
                });
                watch('OnFillPassword', function(callShot) {
                    // assertStuff
                });
                watch('clickLogin', function(callShot) {
                    // assertStuff
                });
                watch('validate', function(callShot) {
                    // assertStuff
                });
            });
        },
        //--模拟过程结束过后观察函数的调用情况
        final: function(){
                spy.called('OnFillUserName, clickLogin, validate');
                spy('validate').shouldCallAfter('clickLogin');
        }
    });
```