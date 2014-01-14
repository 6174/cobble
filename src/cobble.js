/**
 * @desc: cobble facade
 * @author: chenxuejia
 * @email:  chenxuejia@gmail.com
 *
 */
define(function(require, exports, module) {
	var asyn = require('asyn');
	var assert = require('assert');
	var util = require('util');
	var IA = require('IA');
	var _ = require('_');
	var pattern = require('matches').pattern;
	var spy = require('spy');
	var Robot = require('robot');
	var AsynTaskQueue = require('asyntaskQueue');
	var Promise = asyn.Promise;
	var Defer = asyn.Defer;


	//--test suit的类型
	//--syn:  传统的同步类型
	//--asyn: 需要robot异步执行的， 那么类型就是异步的
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
		return testSuitConfig;
	}

	util.mix(Cobble, {
		startTest: function(){
			cobbleTask.run();
		}
	});

	function initialTestSuit(testSuitConfig){
		decorateTestSuit(testSuitConfig);
		switch(testSuitConfig.type){
			case TEST_SUIT_TYPE['syn']: 
				initialSynTestSuit(testSuitConfig);
				break;
			case TEST_SUIT_TYPE['asyn']:
				initialAsynTestSuit(testSuitConfig);
				break;
		}
	}
	function decorateTestSuit(testSuitConfig){
		var self = testSuitConfig;
		util.mix(testSuitConfig, {
			assert: assert,
			robot: new Robot,
			pattern: pattern,
			intelligencer: IA.appointAnIntelligencer(),
			watch: function(funcId, handler){
				self.intelligencer.watch(funcId, _.bind(handler, self));
			},
		});
	}

	function initialSynTestSuit(testSuitConfig){
		var self = testSuitConfig;
		util.mix(testSuitConfig, {
			_run: function(cobbleTaskDefer){
				_.isFunction(self.action) && self.action();
				cobbleTaskDefer.resolve();
			}
		});
	}

	function initialAsynTestSuit(testSuitConfig){
		var self = testSuitConfig;
		util.mix(testSuitConfig, {
			_run: function(cobbleTaskDefer){
				var taskQueue = new AsynTaskQueue;
				taskQueue.push(runSpy);
				taskQueue.push(runAction);
				taskQueue.push(runFinal);
				taskQueue.run();

				function runSpy(defer){
					_.isFunction(self.spy) && self.spy();
					defer.resolve();
				}

				function runAction(defer){
					self.robot.done = function(){
						this.task.push(function(robotDefer){
							// robotDefer.resolve();
							defer.resolve();
						});
						return this;
					}
					_.isFunction(self.action) && self.action(self.robot);
				}

				function runFinal(defer){
					_.isFunction(self.finish) && self.finish();
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