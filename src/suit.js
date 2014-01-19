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

	var suitId = 0;

	//--cobble注册的test suit需要异步执行，
	//--这里通过testSuitTaskQueue来注册cobble里需要异步执行的动作
	var testSuitTaskQueue = new AsynTaskQueue;
	var currentSuit = null;

	function Suit(arg1, arg2) {

		if (!util.isString(arg1)) {
			throw new Error('no test suit name');
			return;
		}

		if (!util.isFunction(arg2)) {
			throw new Error('no test suit handle function');
			return;
		}

		this.id = suitId++;
		this.name = arg1;
		this.action = arg2;
		this.specs = [];
		this._init();
	}


	util.mix(Suit.prototype, {
		_init: function() {
			var self = this;
			util.mix(self, util.getEventHub());
			this._decorateWithExportsApi();
			this._addRunHandler();
			registTestSuitTask(this._run);
		},
		//--外部调用的接口, 在写测试集的受可以通过 this获取。
		_decorateWithExportsApi: function() {
			var self = this;
			util.mix(self, {
				robot: new Robot,
				intelligencer: IA.appointAnIntelligencer(),
				watch: function(funcId, patternConfig) {
					self.intelligencer.watch(funcId, util.proxy(function(callshot) {
						this.callshot = callshot;
						this.result = callshot.result;
						this.args = callshot.args;
						var fn = pattern(patternConfig);
						fn.apply(self, callshot.args);
					}, self));
				},
				getSpyApi: function(funcId) {
					return self.intelligencer.getSpyApi(funcId);
				},
				createSpec: function(description, handler) {
					var spec = new Spec({
						description: description,
						fn: util.proxy(handler, this),
						suit: this
					});

					spec.on('failed', function(e) {
						var msg = '%c Failed suit:' + e.spec.suit.name + ', spec:' + e.spec.description + ' ' + e.message;
						console.log(msg, "color:white; background-color:red");
					});

					spec.on('passed', function() {
						var msg = '%c Passed suit:' + spec.suit.name + ', spec' + spec.description;
						console.log(msg, "color:white; background-color:green");
					});

					self.specs.push(spec);
					spec.execute();
				}
			});
		},
		_addRunHandler: function() {
			var self = this;
			util.mix(self, {
				_run: function(testSuitTaskQueueDefer) {
					currentSuit = self;

					self.done = function(){
						testSuitTaskQueueDefer.resolve();
					}

					self.robot.done = function(){
						this.task.push(function() {
							testSuitTaskQueueDefer.resolve();
						});
					}

					try{
						util.isFunction(self.action) && self.action(self.robot);
					}catch(e){
						self.fire('suit-error', e);
						throw(e);
					}
				}
			});
		}
	});


	//--static method
	util.mix(Suit, {
		startTask: function() {
			testSuitTaskQueue.run();
		},
		getCurrentSuit: function() {
			return currentSuit;
		}
	});


	function registTestSuitTask(task) {
		testSuitTaskQueue.push(task);
	}

	module.exports = Suit;
});