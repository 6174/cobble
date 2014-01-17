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
		spy: spy,
		startTest: function(){
			Suit.startTask();
		},
		describe: function(arg1, arg2){
			new Suit(arg1, arg2);
		},
		it: function(description, handler){
			Suit.getCurrentSuit().createSpec(description, handler);
		}
	};
	module.exports = Cobble;
});