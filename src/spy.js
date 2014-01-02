/**
 * @desc:  spy, watch function execution
 * @author: chenxuejia
 * @email:  chenxuejia@gmail.com
 *
 * @func:
 *      1. 观察函数的参数
 *      2. 函数的结果
 *      3. 执行时间
 *      4. 函数调用关系
 *      5. 一段时间内函数的调用次数
 *      6. 函数抛出的错误情况
 *
 */
define(function(require, exports, module) {
	var util = require('util');
	var slice = Array.prototype.slice;
	var hasOwn = Object.prototype.hasOwnProperty;
	var callId = 0;


	function spy(){

	}
	util.mix(spy, util.getEventHub());

	function spyAObject(obj) {
		for(var attr in obj){
			if(hasOwn.call(obj, attr))
		}
	}

	function spyAFunc(func) {
		func = makeSureAFunc(func);
		func = wrapFuncWithSpyStuff(func);
		decorateFunc(func);
	}

	function makeSureAFunc(func) {
		var tempFunc = func;
		if (!util.isFunction(func)) {
			tempFunc = function() {};
		}
		return tempFunc;
	}

	function wrapFuncWithSpyStuff(func) {
		return util.wrap(func, function(originFunc) {
			var args = slice.call(arguments, 1);
			var thisFunc = arguments.callee;
			var start = +new Date;
			var result = originFunc.apply(this, args);
			thisFunc._callShot = {
				time: +new Date - start,
				id: called++,
				args: args,
				result: result,
				stack: (new Error('-_-')).stack,
				thisValue: this
			}
			spy.fire('call-' + thisFunc.name, thisFunc._callShot);
		});
	}

	function decorateFunc(func) {
		var spyApi = {
			//call:_.id, _.stack, _.args, _.result, _.time, _.exception, _.thisValue
			reset: function reset() {
				util.mix(this, {
					isSpyFunc: true,
					called: false,
					callCount: 0,
					calls: []
				}, true);
			},
			incrementCallCount: function incrementCallCount() {
				this.called = true;
				this.callCount += 1;
				this.notCalled = false;
				this.calledOnce = this.callCount == 1;
				this.calledTwice = this.callCount == 2;
				this.calledThrice = this.callCount == 3;
				this.calls.push(this._callShot);
			}
		}
		mix(func, spyApi);
		func.name = getFuncName()
	}

	function invokeFunc(func, args, thisValue) {
		if (!util.isFunction(func)) return;
		if (!func.isSpyFunc) {
			func.apply(thisValue, args);
		}
		func.apply(thisValue, args);
		func.incrementCallCount();
	}

	function getFuncName(func) {
		return util.functionName(func);
	}

	module.exports = spy;
});