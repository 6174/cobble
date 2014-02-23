/**
 * test spec
 */
define(function(require, exports, module){
	var util = require('util');

	var specId = 0;

	function Spec(config){
		util.mix(this, util.getEventHub());
		this.id = specId ++;
		this.fn = config.fn;
		this.suit = config.suit;
		this.description = config.description;
		this.suit = config.suit;
		this.failedExpectations = [];
	}

	util.mix(Spec.prototype, {
		handleException: function (e){
			e.spec = this;
			this.failedExpectations.push(e);
		},
		execute: function (){
			var self = this;
			try{
				this.fn();
			}catch(e){
				this.handleException(e);
			}
			this.judge();
		},
		judge: function(){
			var status = this.getStatus();
			if(status === 'failed'){
				this.fire('failed', this.failedExpectations[0]);
			} else {
				this.fire('passed');
			}
		},
		getStatus: function (){
			return this.failedExpectations.length > 0 ? 'failed' : 'passed';
		}
	});
	module.exports = Spec;
});