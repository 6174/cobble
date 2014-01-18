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

	//--所有的spy过后的函数都可以在这里看到
	var functionHashTable = {};

	function spy(arg1, namespace) {
		var type = util.typeOf(arg1);
		var ret;
		if(type == 'function'){
			var name = getFuncName(arg1);
			ret = spyAFunc(arg1, namespace? namespace + name : name, name);
		}else if(type == 'object'){
			ret = spyAObject(arg1, '');
		}else if(type == 'string'){
			return functionHashTable[arg1];
		}
		return ret;
	}
	util.mix(spy, util.getEventHub());
	spy.functionHashTable = functionHashTable;

	function spyAObject(obj, namespace) {
		breadthFirstSearchObjForFunc(obj, namespace, name, {});
	}

	function breadthFirstSearchObjForFunc(obj, fullname, name, parent) {
		var type = util.typeOf(obj),
			itemname, item;
		if (type === 'function') {
			spyAFunc(obj, fullname, name, parent);
		}

		if (obj && type !== 'array' && type !== 'string' && type !== 'number' && util.typeOf(obj.hasOwnProperty) === 'function') {
			for (itemname in obj) {
				if (hasOwn.call(obj, itemname)) {
					item = obj[itemname];
					// window.window === window
					// jQuery.fn.constructor === jQuery will introduce endless loop
					if (item !== obj && itemname !== 'constructor') {
						checkObj(item, fullname + '.' + itemname, itemname, obj);
					}
				}
			}
		}
	}

	function spyAFunc(func, fullname, name, parent) {
		parent = parent || {};
		parent[name + "_backup"] = func;
		functionHashTable[fullname + "_backup"] = func;

		func = makeSureAFunc(func);
		decorateFunc(func);
		func = wrapFuncWithSpyStuff(func);

		parent[name] = func;
		functionHashTable[fullname] = func;
		func.fullname = fullname;
		return func;
	}

	function makeSureAFunc(func) {
		var tempFunc = func;
		if (!util.isFunction(func)) {
			tempFunc = function() {};
		}
		return tempFunc;
	}

	function wrapFuncWithSpyStuff(func) {
		var funcBackup = func;
		var func = util.wrap(func, function(originFunc) {
			var args = slice.call(arguments, 1);
			var thisFunc = func;
			var start = +new Date;

			// If this function call is through "new" operator.
			if (arguments.callee.prototype && this instanceof arguments.callee) {
				// http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
				function F(args2) {
					return originFunc.apply(this, args2);
				}
				F.prototype = originFunc.prototype;
				result = new F(args);
			} else {
				result = originFunc.apply(this, args);
			}

			var end = +new Date;
			thisFunc._callShot = {
				startTime: start,
				endTime: end,
				time: end - start,
				args: args,
				result: result,
				stack: (new Error('-_-')).stack,
				thisValue: this,
				thisFunc: thisFunc
			}
			thisFunc.incrementCallCount();
			spy.fire('call-' + thisFunc.fullname, thisFunc._callShot);
			spy.fire('call', {
				funcId: thisFunc.fullname,
				callShot: thisFunc._callShot
			});
			return result;
		});

		//--原来方法的变量和原型
		util.mix(func, funcBackup);
		func.prototype = funcBackup.prototype;
		return func;
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
		util.mix(func, spyApi);
		func.reset();
		return func;
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