/**
 *  @desc: intelligency agency module
 *    负值管理函数spy以及函数执行情况的报告
 *	@author: chenxuejia
 *  @email: chenxuejia67@gmail.com
 *  
 */
define(function(require, exports, module){
	var util = require('util');
	var _ = require('_');
	var spy = require('spy');

	var IntelligencyAgency = {};
	var intelligencers = [];

	util.mix(IntelligencyAgency, {
		spy: spy, 
		intelligencers: intelligencers,
		appointAnIntelligencer: function(){
			var intelligencer = new Intelligencer();
			this.intelligencers.push(intelligencer);
			return intelligencer;
		},
		fireAnIntelligencer: function(intelligencer){
			util.arrRemove(this.intelligencers, intelligencer)	
		}
	});

	spy.on('call', function(ev){
		var funcId = ev.funcId;
		var callShot = ev.callShot;
		_.forEach(intelligencers, function(intelligencer){
			intelligencer.fire(funcId, callShot);
		});
	});

	/**
	 * 情报员， 对应一个testsuit
	 * 在一个testSuit内watch的函数的执行情况都可以通过interlligencer来获取
	 */
	function Intelligencer(){
		//--保存调用顺序
		this.calls = [];
		//--方便获取
		this.hashedCalls = {};
		util.mix(this, util.getEventHub());
	}

	util.mix(Intelligencer.prototype, {
		watch: function(funcId, handler){
			this.on(funcId, function(ev){
				this.calls.push({
					id: funcId,
					call: ev
				});
				this.hashedCalls[funcId] = this.hashedCalls[funcId] || new SpyApi(funcId);
				this.hashedCalls[funcId].push(ev);
				handler(ev);
			});
		},
		//--stuff about function-calls api 
		getCallSequece: function(){
			var ret = '';
			_.forEach(this.calls, function(aCall){
				ret += aCall.funcId;
			});
			return ret;
		},
		getSpyApi: function(funcId){
			var ret = this.hashedCalls[funcId];
			if(!ret){
				throw new Error('did not watch on ' + funcId);
			}
			return ret;
		}
	});

	function SpyApi(funcId){
		this.id = funcId;
		this.calls = [];
	}
	util.mix(SpyApi.prototype, {
		push: function(call){
			this.calls.push(call);
		},
		getCallCount: function(){
			return  this.calls.length;
		},
		called: function(){
			return this.calls.length > 0;
		},
		calledOnce: function() {
			return this.calls.length === 1;
		},
		calledTwice: function() {
			return this.calls.length === 2;
		},
		calledThirce: function() {
			return this.calls.length === 3;
		},
		getCallAt: function(index){
			return this.calls[index];
		},
		getFirstCall: function(){
			return this.calls[0];
		}
	});
	module.exports = IntelligencyAgency; 
});
