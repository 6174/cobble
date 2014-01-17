/**
 * test spec
 */
define(function(require, exports, module){
	var util = require('util');

	function Spec(config){
		util.mix(this, util.getEventHub());
		this.fn = config.fn;
		this.suit = config.suit;
		this.description = config.description;
		this.suit = config.suit;
		this.failedExpectations = [];
	}

	util.mix(Spec.prototype, {
		addExpectation: function (e){
			this.failedExpectations.push()
		},
		execute: function (){
			var self = this;
			self.fire('start');
			try{
				fn();
			}catch(e){
				self.addExpectation(e);
			}
			self.fire('end');
		}
	});
	module.exports = Spec;
});