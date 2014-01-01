/**
 * @desc:  robot, mock user ations
 * @author: chenxuejia
 * @email: chenxuejia67@gmail.com
 * @usage:
 *
 *     click, wait, tilhas, ok
 *         Robot().click("#btn").wait(1).dblclick("#newBtn").tilhas("#someDom").do(action).wait(3).ok();
 *
 *     repeat
 *         Robot().repeat(4, action, 2000).do(action).ok();
 *         Robot().repeat(1, [action1, action2, action3], 2000)
 */
define(function(require, exports, module) {

	// 通过 require 引入依赖
	var jquery = require('jquery');

	function Robot() {
		if (!(this instanceof Robot)) {
			return new Robot(arguments);
		}

		//-- promise modle
		//== promise 三状态 pending(默认状态) ,fulfilled, rejected
		this.state = 'pending';
		this.ok = function(obj) {
			return obj
		};
		this.thens = [];
	}
	var RobotProto = Robot.prototype;

	/**
	 * @method -- resolve
	 * @desc   -- 默认状态可以单向转移到完成状态
	 */
	RobotProto.resolve = function(obj) {
		if (this.state !== 'pending') {
			return;
		}
		this.state = 'fulfilled';
		this.result = this.ok(obj);

		for (var i = 0, len = this.thens.length; i < len; i++) {
			var then = this.thens[i];
			this._fire(then.promise, then.ok);
		}
		return this;
	}

	RobotProto._fire = function(nextPromise, nextOk) {
		var nextResult = nextOk(this.result);
		if (nextResult instanceof Robot) {
			nextResult._then(function(obj) {
				nextPromise.resolve(obj);
			});
		} else {
			nextPromise.resolve(nextResult);
		}
		return nextPromise;
	}

	RobotProto._push = function(nextPromise, nextOk) {
		this.thens.push({
			promise: nextPromise,
			ok: nextOk
		});
		return nextPromise;
	}


	RobotProto._then = function(nextOk){
		var promise = new Robot();
		if (this.state === 'fulfilled'){
			//--立即调用nextOk
			return this._fire(promise, nextOk);
		} else {
			return this._push(promise, nextOk);
		}
	}


	/**
	 * mock click
	 */
	RobotProto.click = function(id) {
		var promise = this._then(function(){
			$(id).click();
			var promise = new Robot();
			setTimeout(function() {
				promise.resolve();
			}, 10);
			return promise;
		});
		return promise;
	}


	/**
	 * wait
	 */
	RobotProto.wait = function(seconds) {
		return this._then(function(){
			var promise = new Robot();
			setTimeout(function() {
				promise.resolve();
			}, seconds*1000);
			return promise;
		});
	}

	RobotProto.run = function(){
		this.resolve();
	}

	// // 或者通过 module.exports 提供整个接口
	module.exports = Robot;
});