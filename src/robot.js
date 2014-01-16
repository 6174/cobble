/**
 * @desc:  Promise, simulate user ations
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

	function Robot() {
		if (!(this instanceof Robot)) {
			return new Robot();
		}
		this.task = new Task(true);
	}
	var RobotProto = Robot.prototype;

	RobotProto.click = function(id, options) {
		this.task.push(function(defer) {
			$(id).simulate('click', options || findElementCenter(id));
			setTimeout(function() {
				defer.resolve();
			}, 10);
		});
		return this;
	}

	RobotProto.mouseover = function(id, options) {
		this.task.push(function(defer) {
			$(id).simulate('mouseover', options || findElementCenter(id));
			setTimeout(function() {
				defer.resolve();
			}, 10);
		});
		return this;
	}

	RobotProto.mouseout = function(id, options) {
		this.task.push(function(defer) {
			$(id).simulate('mouseout', options || findElementCenter(id));
			setTimeout(function() {
				defer.resolve();
			}, 10);
		});
		return this;
	}


	RobotProto.select = RobotProto.input = function(id, value, time) {
		this.task.push(function(defer) {
			$(id).val(value);
			$(id).change();
			setTimeout(function() {
				defer.resolve();
			}, time ? time * 1000 : 10)
		});
		return this;
	}

	RobotProto.wait = function(seconds) {
		this.task.push(function(defer) {
			setTimeout(function() {
				defer.resolve();
			}, seconds * 1000);
		});
		return this;
	}

	RobotProto.then = function(func) {
		this.task.push(function(defer) {
			func();
			defer.resolve();
		});
		return this;
	}


	function findElementCenter(elem) {
		var offset,
			document = $(elem.ownerDocument);
		elem = $(elem);
		offset = elem.offset();

		return {
			clientX: offset.left + elem.outerWidth() / 2 - document.scrollLeft(),
			clientY: offset.top + elem.outerHeight() / 2 - document.scrollTop()
		};
	}

	module.exports = Robot;
});