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

	/**
	 * intention coding 
	//  */
	// Cobble({
	// 	printCallStack: true,
	// 	action: function() {
	// 		return robot()
	// 			.input('#UserName', '6174')
	// 			.wait(1)
	// 			.input('#Password', '131420')
	// 			.wait(1)
	// 			.click('#Login')
	// 			.wait(1)
	// 			.done();
	// 	},
	// 	describes: function() {
	// 		describe('user login', function() {
	// 			watch('OnFillUserName', function(callShot) {
	// 				// assertStuff;
	// 			});
	// 			watch('OnFillPassword', function(callShot) {
	// 				// assertStuff
	// 			});
	// 			watch('clickLogin', function(callShot) {
	// 				// assertStuff
	// 			});
	// 			watch('validate', function(callShot) {
	// 				// assertStuff
	// 			});
	// 			assert(spy('validate').shouldCallAfter('clickLogin'));
	// 		});
	// 	}
	// });

	Cobble.describe = function describe() {
	}
});