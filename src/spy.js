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
	var slice = Array.prototype.slice;
	var util = require('util');
	var callId = 0;

	function spyAFunc(func){
		func = makeSureAFunc(func);
		func = wrapFuncWithSpyStuff(func);
		decorateFunc(func);
	}

	function makeSureAFunc(func){
		var tempFunc = func;
		if(!util.isFunction(func)){
			tempFunc = function(){};
		}
		return tempFunc;
	}

	function wrapFuncWithSpyStuff(func){
		return util.wrap(func, function(originFunc){
			var args = slice.call(arguments, 1);
			var start = +new Date;
			var result = originFunc.apply(this, args);
			arguments.callee._callShot = {
				time: +new Date - start,
				id: called ++,
				args: args,
				result: result,
				stack: (new Error('-_-')).stack,
				thisValue: this
			} 
		});
	}

	function decorateFunc(func){
		var spyApi = {
			//call:_.id, _.stack, _.args, _.result, _.time, _.exception, _.thisValue
			reset: function reset(){
				util.mix(this, {
					isSpyFunc: true,
					called: false,
					callCount: 0,
					calls: []
				}, true);
			},
			idC
		}
	}

	function invokeFunc(func, thisValue, args){
		if(!util.isFunction(func)) return;
		if(!func.isSpyFunc){
			func.apply(thisValue, args);
		}
		func.apply(thisValue, args);
		func.called = true;
		func.callCount ++;
		func.calls.push(func._callShot);
	}

	function getFuncName(func){

	}
});