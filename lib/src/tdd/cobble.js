/**
 * @desc: cobble facade
 * @author: chenxuejia
 * @email:  chenxuejia@gmail.com
 *
 */
define(function(require, exports, module) {
	var expect = require('expect');
	var Suit = require('suit');
	var util = require('util');
	var pattern = require('matches').pattern;
	var spy = require('spy');

	var Cobble = {
		expect: expect,
		pattern: pattern, 
		spy: function(arg1, arg2){
			if(util.isString(arg1) && !arg2){
				return Suit.getCurrentSuit().getSpyApi(arg1);
			} else{
				return spy(arg1, arg2);
			}
		},
		startTest: function(){
			Suit.startTask();
		},
		describe: function(arg1, arg2){
			new Suit(arg1, arg2);
		},
		it: function(description, handler){
			Suit.getCurrentSuit().createSpec(description, handler);
		},
		done: function(){
			Suit.getCurrentSuit().done();
		},
		watch: function(arg1, arg2){
			Suit.getCurrentSuit().watch(arg1, arg2);
		},
		robot: function(){
			return Suit.getCurrentSuit().robot;
		},
		expose: function(){
			util.mix(window, {
				describe: this.describe,
				spy: this.spy,
				robot: this.robot,
				watch: this.watch,
				done: this.done,
				it: this.it,
			});
		}
	};
	module.exports = Cobble;
});