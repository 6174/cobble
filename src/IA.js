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
		this.calls = [];
		util.mix(this, util.getEventHub());
	}

	util.mix(Intelligencer.prototype, {
		watch: function(funcId, handler){
			this.on(funcId, function(ev){
				this.calls.push({
					funcId: funcId,
					callShot: ev
				});
				handler(ev);
			});
		},
		getCallSequece: function(){
			var ret = '';
			_.forEach(this.calls, function(aCall){
				ret += aCall.funcId;
			});
			return ret;
		}
	});
	module.exports = IntelligencyAgency; 
});
