#Cobble 专注于前端的测试框架

##介绍  
---
   
&nbsp;&nbsp;&nbsp;&nbsp;
我知道`TDD`在项目开发中的power， 但是对于一个前端从业人员来说， 在真正的项目开发过程当中很难应用这种能力. 特别是在facebook， 阿里， 腾讯这样的大公司在实际前端开发过程中也没用完全应用TDD的能力， 只是部分的框架代码会用到TDD。

&nbsp;&nbsp;&nbsp;&nbsp;
`jasmine`， `mocha`这些`xunit`测试框架更适用于node环境的`业务逻辑`和`数据处理`相关的代码。 然而对于前端开发来说，原有的测试策略不适宜，出去`dom结构和样式属性`这些问题， 前端开发中的测试更需要`ATDD`, 因为前端的一个核心是处理`交互`  或者更恰当的说是介于TDD和ATDD之间，交互和业务逻辑永远是结合在一起的。 

&nbsp;&nbsp;&nbsp;&nbsp;
 `selenuim`能够进行前端的`ATDD`测试，ATDD不能驱动我们编写实际业务代码，因为为了完成ATDD的机会成本是很大的，
我们更愿意花更多的时间在业务逻辑代码编写上面， 而把ATDD以及相关的测试脚本交给测试人员。 这也符合`测试驱动开发`的精神如果按照TDD的测试精神， 测试应该快速完成， 测试脚本的编写不应该花很多时间， 测试脚本是为了驱动编写实际逻辑的意向变成方法。

&nbsp;&nbsp;&nbsp;&nbsp;
cobble的目的就是为了实现一个**介于ATDD和TDD**的以驱动逻辑代码编写为目的的测试框架，**以前端开发为核心， 围绕交互异步， dom样式属性这些前端问题而生的测试框架**。  


##结构
---

**cobble分为以下的模块结构设计:**

        
    源文件                  | 功能
    ----------------------- | -------------------------------------
    [src/asyn.js]           | promise A+实现， 这是异步的核心模块
    [src/asynTaskQueue.js]  | 异步执行队列模块
    [src/cobble.js]         | cobble facade
    [src/IA.js]             | 函数执行情况为情报， 通过间谍来获取， 通过情报员来汇报报。 而这个模块是和所有情报相关工作的对外接口
    [src/reporter.js]       | html reporter， 将测试结果动态的输出到页面当中
    [src/robot.js]          | 用户行为模拟模块， 包括鼠标事件，表单填写提交这行行为的模拟， 童工asynTaskQueue来实现
    [src/spec.js]           | test spec
    [src/spy.js]            | 函数spy， 监控函数的执行情况
    [src/suit.js]           | test suit
    [src/util.js]           | 工具类
    [src/lib/expect.js]     | BDD的测试断言
    [src/lib/matches.js]    | 模式匹配

>cobble不仅仅是提醒代码断言错误， 而是可以帮助开发人员找出错误所在， 在前端开发当中， 函数是核心。 所以cobble中测试的基本单位是函数，围绕单个函数的执行情况来做断言，cobble中可以获取函数执行时候的`参数`， `上下文`， `调用栈`可以查看函数`执行次数`， `调用关系`，`调用顺序` 。  

* 测试代码编写为两部分  
    - 测试case的编写  
    - 函数标记， 通过注释方式  
* 解析， 写一个服务编译注释脚本， 返回编译过的脚本用于spy监控  

##使用  
---
以一个登陆测试为例子   

```javascript  
    cobble.describe({ 
        //--对模拟过程中的函数进行观察， 并通过callShot可以查看
         函数调用的参数， 结果， 时间， 上下文情况，
        spy: function() {
                //--对函数调用的观察
                this.watch('OnFillUserName', function(ev) {
                    it('OnFillUserName should call with string', function(){
                        expect(ev.args[0]).to.be.a('string');
                    });
                    it('OnFillUserName should return a boolean', function(){
                        expect(ev.result).to.be.a('boolean');
                    });
                });
            });
        },
        //--mock 的用户行为， 目前在test/testRobot.html下面已经可以看到使用场景了, 使用promise A+模型极大的简化了异步行为的编写， 目前只有简单的click input wait方法 
        action: function() {
                this.robot.
                .input('#UserName', '6174')
                .wait(1)
                .then(function(){
                    it('should called OnFillUserName', function(){
                        expect(spy('OnFillUserName').called()).to.be.ok();
                    });
                })
                .input('#Password', '131420')
                .wait(1)
                .click('#Login')
                .done();
        },
    });

```  



