/**
 * @desc:  Promise, mock user ations
 * @author: chenxuejia
 * @email: chenxuejia67@gmail.com
 * @usage:
 *
 *     click, wait, tilhas, ok
 *         Promise().click("#btn").wait(1).dblclick("#newBtn").tilhas("#someDom").do(action).wait(3).ok();
 *
 *     repeat
 *         Promise().repeat(4, action, 2000).do(action).ok();
 *         Promise().repeat(1, [action1, action2, action3], 2000)
 */
define(function(require, exports, module) {

	// 通过 require 引入依赖
	var jquery = require('jquery');
	var Task = require('asynTaskQueue');

	function Robot(){
		if(!(this instanceof Robot)){
			return new Robot();
		}
		this.task = new Task;
	}
	var RobotProto = Robot.prototype;
	/**
	 * mock click
	 */
	RobotProto.click = function(id, time) {
		this.task.push(function(defer) {
			$(id).click();
			setTimeout(function() {
				defer.resolve();
			}, time ? time * 1000 : 10);
			return defer.promise;
		});
		return this;
	}

	/**
	 * mock fill input filed
	 */
	RobotProto.input = function(id, value, time){
		this.task.push(function(defer) {
			$(id).val(value);
			setTimeout(function(){
				defer.resolve();
			}, time ? time * 1000 : 10)
			return defer.promise;
		});
		return this;
	}

	/**
	 * wait
	 */
	RobotProto.wait = function(seconds) {
		this.task.push(function(defer) {
			setTimeout(function() {
				defer.resolve();
			}, seconds * 1000);
			return defer.promise;
		});
		return this;
	}

	RobotProto.then = function(func){
		this.task.push(func);
		return this;
	}

	module.exports =  Robot;
});