/**
 * @desc: asyn task queue methods
 */
define(function(require, exports, module){
	var asyn = require('asyn');
	var util = require('util');
	
	var Promise = asyn.Promise;
	var Defer = asyn.Defer;

	function AsynTaskQueue(){
		this.promise = Promise();
	}

	util.mix(AsynTaskQueue.prototype, {
		push: function (task){
			task = wrapTask(task);
			return this.promise = this.promise.then(task);
		}
	});

	function wrapTask(task){
		var defer = new Defer();
		return function(){
			return task.call(this, defer);
		}
	}
	module.exports = AsynTaskQueue;
});