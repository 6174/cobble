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
	var pattern = require('matches').pattern;
	var IA = require('IA');
	var Robot = require('robot');
	var Spec = require('spec');

	var Promise = asyn.Promise;
	var Defer = asyn.Defer;


	//--test suit的类型
	//--syn:  传统的同步类型
	//--asyn: 需要robot异步执行的， 那么类型就是异步的
	var TEST_SUIT_TYPE = {
		'syn': 1,
		'asyn': 2
	};

	var suitId = 0;

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
		this.name = testSuitName;
		this._init(testSuitConfig);
	}


	util.mix(Suit.prototype, {
		_init: function(config){
			var self = this;
			util.mix(self, config);

			this.id = suitId ++;
			this.specs = [];
			this._decorate();
			//-- strategy
			switch(self.type){
				case TEST_SUIT_TYPE['syn']: 
					initialSynTestSuit(this);
					break;
				case TEST_SUIT_TYPE['asyn']:
					initialAsynTestSuit(this);
					break;
			}
			registTestSuitTask(this._run);
		},
		//--外部调用的接口
		_decorate: function(){
			var self = this;			
			util.mix(self, {
				robot: new Robot,
				intelligencer: IA.appointAnIntelligencer(),
				watch: function(funcId, patternConfig){
					self.intelligencer.watch(funcId, util.proxy(function(callshot){
						this.callshot = callshot;
						this.result = callshot.result;
						this.args = callshot.args;
						var fn = pattern(patternConfig);
						fn.apply(self, callshot.args);
					}, self));
				}
			});
		},
		getSpyApi: function(funcId){
			return this.intelligencer.getSpyApi(funcId);
		},
		createSpec: function(description, handler){
			var spec = new Spec({
					description: description,
					fn: util.proxy(handler, this),
					suit: this
				});

			spec.on('failed', function(e){
				var msg = '%c Failed suit:' + e.spec.suit.name + ', spec:' + e.spec.description + ' ' + e.message; 
				console.log(msg, "color:white; background-color:red");
			});

			spec.on('passed', function(){
				var msg = '%c Passed suit:' + spec.suit.name + ', spec' + spec.description;
				console.log(msg, "color:white; background-color:green");
			});

			this.specs.push(spec);
			spec.execute();
		},

	});


	util.mix(Suit, {
		startTask: function(){
			testSuitTaskQueue.run();
		},
		getCurrentSuit: function(){
			return currentSuit;
		}
	});

	function initialSynTestSuit(testSuit){
		var self = testSuit;
		util.mix(testSuit, {
			_run: function(testSuitTaskQueueDefer){
				currentSuit = testSuit;
				util.isFunction(self.action) && self.action();
				testSuitTaskQueueDefer.resolve();
			}
		});
	}

	function initialAsynTestSuit(testSuit){
		var self = testSuit;
		util.mix(testSuit, {
			_run: function(testSuitTaskQueueDefer){
				currentSuit = testSuit;
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

	function registTestSuitTask(task){
		testSuitTaskQueue.push(task);
	}

	module.exports = Suit;
});