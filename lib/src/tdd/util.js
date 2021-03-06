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
			if (hasOwn.call(trait, attr) && !(isCoverOriginMethod && obj[attr])) {
				obj[attr] = trait[attr];
			}
		}
	}

	util.proxy = function(func, context) {
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
          return r;
       });
     */
	util.wrap = function(func, wrapper) {
		var __method = func;
		return function() {
			var args = Array.prototype.slice.call(arguments);
			return wrapper.apply(this, [__method.bind(this)].concat(args));
		}
	};

	util.heredoc = function(f) {　
	    return f.toString().replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '');
	}
	
	util.create = function(o) {
		function F() {};
		F.prototype = o;
		return new F();
	}

	/**
	 *Klass 语法糖
	 */
	util.Klass = function(Parent, props) {
		var Child, F, i;

		Child = function() {
			var parent = Child.parent;
			while (parent) {
				parent.prototype && parent.prototype.hasOwnProperty("__construct") && parent.prototype.__construct.apply(this, arguments);
				parent = parent.parent;
			}
			if (Child.prototype.hasOwnProperty("__construct")) {
				Child.prototype.__construct.apply(this, arguments);
			}
			this.super = Parent.prototype;
		};

		Parent = Parent || Object;
		F = function() {};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.parent = Parent;
		Child.super = Parent.prototype;
		Child.prototype.constructor = Child;

		for (i in props) {
			if (props.hasOwnProperty(i)) {
				Child.prototype[i] = props[i];
			}
		}

		return Child;
	}
	/**
	 * Escape text for attribute or text content.
	 */
	util.escapeText = function escapeText(s) {
		if (!s) {
			return "";
		}
		s = s + "";
		// Both single quotes and double quotes (for attributes)
		return s.replace(/['"<>&]/g, function(s) {
			switch (s) {
				case "'":
					return "&#039;";
				case "\"":
					return "&quot;";
				case "<":
					return "&lt;";
				case ">":
					return "&gt;";
				case "&":
					return "&amp;";
			}
		});
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
		isElement: function (obj) {
			return div && obj && obj.nodeType === 1 && isDOMNode(obj);
		},
		isFunction: function (obj) {
			return typeof obj === "function" || !! (obj && obj.constructor && obj.call && obj.apply);
		},
		isString: function (obj) {
			return this.isA(obj, 'string');
		},
		isNumber: function (obj){
			return this.isA(obj, 'number');
		},
		isA: function (obj, type) {
			return this.typeOf(obj) === type;
		},
		functionName: function (func) {
			var name = func.displayName || func.name;
			if (!name) {
				var matches = func.toString().match(/function ([^\s\(]+)/);
				name = matches && matches[1];
			}
			return name;
		},
		typeOf: function(value) {
			if (value === null) {
				return "null";
			} else if (value === undefined) {
				return "undefined";
			}

			var string = Object.prototype.toString.call(value);
			string = string.substring(8, string.length - 1).toLowerCase()
			if (string == 'number' && value != +value) {
				string = 'NaN';
			}

			if (string == 'global') {
				string = 'object';
			}

			return string;
		},

	});

	util.getEventHub = function() {
		return {
			on: function(type, callback) {
				if (!util.isFunction(callback)) {
					throw new Error('callback is not a function');
					return;
				}
				this._callback = this._callback || {};
				this._callback[type] = this._callback[type] || [];
				this._callback[type].push(callback);
				return this;
			},
			detach: function(type, callback) {
				this._callback = this._callback || {};
				if (!type) {
					this._callback = {};
				} else if (!callback) {
					this._callback[type] = [];
				} else if (this._callback[type] && this._callback[type].length > 0) {
					var index = S.indexOf(callback, this._callback[type]);
					if (index != -1) this._callback[type].splice(index, 1);
				}
				return this;
			},
			fire: function(type, data) {
				if (this._callback) {
					var arr = this._callback[type];
					if (arr && arr.length > 0) {
						data = data || {};
						data.type = type;
						data.target = this;

						for (var i = arr.length - 1; i >= 0; i--) {
							util.isFunction(arr[i]) && arr[i].call(this, data);
						}
					}
				}
				return this;
			}
		};
	};

	//--array extend
	mix(util, {
		arrRemove: function arrRemove(arr, item) {
			var index  = arr.indexOf(item);
			if(index >= 0){
				arr.splice(index, 1);
			} 
		}
	});



	module.exports = util;
});