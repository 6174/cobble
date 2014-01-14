/**
 * @desc: asyn task queue methods
 */
define(function(require, exports, module){
	var asyn = require('asyn');
	var util = require('util');
	
	var Promise = asyn.Promise;
	var Defer = asyn.Defer;

	function AsynTaskQueue(isNeedRunAtInitial){
		this.defer = new Defer();
		this.promise = this.defer.promise;
		if(isNeedRunAtInitial){
			this.run();
		}
	}

	util.mix(AsynTaskQueue.prototype, {
		push: function (task){
			task = wrapTask(task);
			this.promise = this.promise.then(task);
			return this;
		},
		run: function(){
			this.defer.resolve();
		}
	});

	function wrapTask(task){
		var defer = new Defer();
		return function(){
			task.call(this, defer);
			return defer.promise; 
		}
	}
	module.exports = AsynTaskQueue;
});