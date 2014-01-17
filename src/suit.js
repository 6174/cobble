/**
 * @desc: test suit
 * @author: chenxuejia
 * @email:  chenxuejia@gmail.com
 *
 */
define(function(require, exports, module) {
	var asyn = require('asyn');
	var AsynTaskQueue = require('asyntaskQueue');
	var util = require('util');
	var IA = require('IA');
	var Robot = require('robot');
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
	//--这里通过testSuitTaskQueue来注册cobble里需要异步执行的动作
	var testSuitTaskQueue = new AsynTaskQueue;
	var currentSuit = null;
	function Suit(arg1, arg2){
		if(!util.isString(arg1)){
			return;
		}
		var testSuitName = arg1;
		var testSuitConfig;
		if(util.isFunction(arg2)){
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
		util.mix(this, testSuitConfig);
		currentSuit = this;
	}

	util.mix(Suit, {
		startTask: function(){
			testSuitTaskQueue.run();
		},
		getCurrentSuit: function(){
			return currentSuit;
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
			robot: new Robot,
			intelligencer: IA.appointAnIntelligencer(),
			watch: function(funcId, handler){
				self.intelligencer.watch(funcId, util.proxy(handler, self));
			},
		});
	}

	function initialSynTestSuit(testSuitConfig){
		var self = testSuitConfig;
		util.mix(testSuitConfig, {
			_run: function(testSuitTaskQueueDefer){
				util.isFunction(self.action) && self.action();
				testSuitTaskQueueDefer.resolve();
			}
		});
	}

	function initialAsynTestSuit(testSuitConfig){
		var self = testSuitConfig;
		util.mix(testSuitConfig, {
			_run: function(testSuitTaskQueueDefer){
				var taskQueue = new AsynTaskQueue;
				taskQueue.push(runSpy);
				taskQueue.push(runAction);
				taskQueue.push(runFinal);
				taskQueue.run();

				function runSpy(defer){
					util.isFunction(self.spy) && self.spy();
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
					util.isFunction(self.action) && self.action(self.robot);
				}

				function runFinal(defer){
					util.isFunction(self.finish) && self.finish();
					defer.resolve();
					testSuitTaskQueueDefer.resolve();
				}
			}
		});
	}

	function registTestSuit(testSuitConfig){
		testSuitTaskQueue.push(testSuitConfig._run);
	}

	module.exports = Suit;
});