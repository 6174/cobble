/**
 * @desc: cobble facade
 * @author: chenxuejia
 * @email:  chenxuejia@gmail.com
 *
 */
define(function(require, exports, module) {
	var asyn = require('asyn');
	var util = require('util');
	var _ = require('_');
	var spy = require('spy');
	var robot = require('robot');
	var AsynTaskQueue = require('asyntaskQueue');
	var Promise = asyn.Promise;
	var Defer = asyn.Defer;


	//--test suit的类型， 传统的类型是同步的syn
	//--需要robot异步执行的， 那么类型就是异步的asyn
	var TEST_SUIT_TYPE = {
		'syn': 1,
		'asyn': 2
	};

	//--cobble注册的test suit需要异步执行，
	//--这里通过cobbleTask来注册cobble里需要异步执行的动作
	var cobbleTask = new AsynTaskQueue;

	function Cobble(arg1, arg2){
		if(!_.isString(arg1)){
			return;
		}
		var testSuitName = arg1;
		var testSuitConfig;
		if(_.isFunction(arg2)){
			testSuitConfig = {
				type: TEST_SUIT_TYPE['syn'],
				action: arg2
			};
		} else {
			testSuitConfig = arg2;
			testSuitConfig.type = TEST_SUIT_TYPE['asyn']; 
		}
		testSuitConfig.name = testSuitName;
		initialTestSuit(testSuitConfig);
		registTestSuit(testSuitConfig);
	}

	util.mix(Cobble, {
		startTest: function(){
			cobbleTask.run();
		}
	});

	function initialTestSuit(testSuitConfig){
		switch(testSuitConfig.type){
			case TEST_SUIT_TYPE['syn']: 
				initialSynTestSuit(testSuitConfig);
				break;
			case TEST_SUIT_TYPE['asyn']:
				initialAsynTestSuit(testSuitConfig);
				break;
		}
	}

	function initialSynTestSuit(testSuitConfig){
		util.mix(testSuitConfig, {
			_run: function(cobbleTaskDefer){
				_.isFunction(this.action) && this.action();
				_.isFunction(this.finish) && this.finish(); 
				cobbleTaskDefer.resolve();
			}
		})
	}

	function initialAsynTestSuit(testSuitConfig){
		util.mix(testSuitConfig, {
			robot: new Robot,
			spy: spy,
			_run: function(cobbleTaskDefer){
				var taskQueue = new AsynTaskQueue;
				taskQueue.push(runAction);
				taskQueue.push(runWatch);
				taskQueue.push(runFinal);
				function runAction(defer){
					this.robot.done = function(){
						defer.resolve;
					}
					_.isFunction(this.action) && this.action(this.robot);
				}

				function runWatch(defer){
					_.isFunction(this.watch) && this.watch(this.spy)
					defer.resolve;
				}

				function runFinal(defer){
					_.isFunction(this.finish) && this.finish();
					defer.resolve();
					cobbleTaskDefer.resolve();
				}
			}
		});
	}

	function registTestSuit(testSuitConfig){
		cobbleTask.push(testSuitConfig._run);
	}

	module.exports = Cobble;
});