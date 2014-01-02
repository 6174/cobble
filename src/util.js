/**
 * define util module
 * @author chenxuejia
 */
define(function(require, exports, module) {
	var util = {};
	var div = typeof document != "undefined" && document.createElement("div");
	var hasOwn = Object.prototype.hasOwnProperty;

	util.guid = function() {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	};

	var mix = util.mix = function(obj, trait, isCoverOriginMethod) {
		for (var attr in trait) {
			if (trait.hasOwnProperty(attr) && !(isCoverOriginMethod && obj[attr])) {
				obj[attr] = trait[attr];
			}
		}
	}

	util.proxy = function(context, func) {
		return function() {
			func.apply(context, arguments);
		}
	};

	/*
     eg:
     f=wrap(f, function(org,x,y){
         console.log("x:"+x,"y:"+y);
          var r=org(x,y);
          console.log("result:"+r);
       });
     */
	util.wrap = function(func, wrapper) {
		var __method = func;
		return function() {
			var args = Array.prototype.slice.call(arguments);
			return wrapper.apply(this, [__method.bind(this)].concat(args));
		}
	};

	util.create = function(o){
		function F() {};
		F.prototype = o;
		return new F();
	}


	mix(util, {
		isDOMNode: function isDOMNode(obj) {
			var success = false;
			try {
				obj.appendChild(div);
				success = div.parentNode == obj;
			} catch (e) {
				return false;
			} finally {
				try {
					obj.removeChild(div);
				} catch (e) {}
			}

			return success;
		},
		isElement: function isElement(obj) {
			return div && obj && obj.nodeType === 1 && isDOMNode(obj);
		},
		isFunction: function isFunction(obj) {
			return typeof obj === "function" || !! (obj && obj.constructor && obj.call && obj.apply);
		},
		functionName: function functionName(func) {
			var name = func.displayName || func.name;
			if (!name) {
				var matches = func.toString().match(/function ([^\s\(]+)/);
				name = matches && matches[1];
			}
			return name;
		},
		typeOf: function (value) {
            if (value === null) {
                return "null";
            }
            else if (value === undefined) {
                return "undefined";
            }
            var string = Object.prototype.toString.call(value);
            return string.substring(8, string.length - 1).toLowerCase();
        },

	});
	module.exports = util;
});