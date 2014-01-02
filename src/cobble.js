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
		/**
		 *
		 */
		describe({
			printCallStack: true,
			action: function() {
				return robot()
					.input('#UserName', '6174')
					.wait(1)
					.input('#Password', '131420')
					.wait(1)
					.click('#Login')
					.wait(1)
					.done();
			},
			describes: function() {
				describe('user login', function() {
					spy('OnFillUserName', function(callShot) {
						// assertStuff;
					});
					spy('OnFillPassword', function(callShot) {
						// assertStuff
					});
					spy('clickLogin', function(callShot) {
						// assertStuff
					});
					spy('validate', function(callShot) {
						// assertStuff
					});
					assert(spy('validate').shouldCallAfter('clickLogin'));
				});
			}
		});
	}

});