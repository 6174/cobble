/**
 * @desc: cobble facade
 * @author: chenxuejia
 * @email:  chenxuejia@gmail.com
 *
 */
define(function(require, exports, module) {
	var Cobble = {};
	var util = require('util');
	var spy = require('spy');
	var robot = require('robot');

	util.mix(Cobble, {
		spy: spy,
		robot: robot
	});

 
	Cobble.describe = function describe() {
	}
});