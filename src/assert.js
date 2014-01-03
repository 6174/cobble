/**
 * @desc: cobble assert module
 * @author: chenxuejia
 * @email: chenxuejia67@gmail.com
 *
 */
define(function(require, exports, module) {
	var Assert = {};
	var util = require('util');
	var _ = require('_');
	var hasOwn = Object.prototype.hasOwnProperty;

	var ASSERT_CONFIG = {
		testName: 'undefined'
	}; 

	util.mix(Assert, util.getEventHub());
	util.mix(Assert, {
		/**
		 * @example ok( "asdfasdf".length > 5, "There must be at least 5 chars" );
		 */
		ok: function ok(result, msg, errMsg) {
			result = !! result;
			msg = msg || (result ? "okay" : "failed");

			var source,
				details = {
					name: 'config.current.testName',
					result: result,
					message: msg,
					errorMessage: errMsg
				};
			//--find error source
			this.fire("log", details);
			return result;
		},
		equal: function (actual, expected, msg){
			return this.ok(_.isEqual(actual, expected), msg);
		},
		notEqual: function (actual, expected, msg){
			return this.ok(!_.isEqual(actual, expected), msg);
		},
		isArray: function (obj, msg){
			return this.isA('array', obj, msg);
		},
		isObject: function (obj, msg){
			return this.isA('object', obj, msg);
		},
		isFunction: function (obj, msg){
			return this.isA('function', obj, msg);
		},
		isNumber: function (obj, msg){
			return this.isA('number', obj, msg);
		},
		isString: function (obj, msg){
			return this.isA('string', obj, msg);
		},	
		isNull: function (obj, msg){
			return this.isA('null', obj, msg);
		},
		isUndefined: function (obj, msg){
			return this.isA('undefined', obj, msg);
		},
		isNaN: function (obj, msg){
			return this.isA('NaN', obj, msg);
		},
		isBoolean: function (obj, msg){
			return this.isA('boolean', obj, msg);
		},
		isA: function (typeString, obj, msg){
			var type = util.typeOf(obj);
			var errMsg = "type is " + type;
			return  this.ok( type === typeString, msg, errMsg);
		},
		has: function(obj, key, msg){
			var errMsg = "has no property: " + key;
			return this.ok(_.has(obj, key), msg, errMsg);
		}
	});
	


	/**
	 * handle log info, use console or 
	 */
	Assert.on('log', function(data){
		//--use reporter to report out of the masgs
	});

	util.mix(Assert, {
		config: function(name, value){
			ASSERT_CONFIG[name] = value;
		},
		getConfig: function (name){
			return ASSERT_CONFIG[name];
		}
	});
	module.exports = Assert;
});