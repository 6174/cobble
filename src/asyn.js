/**
 * @module promise
 */
define(function(require, exports, module){
	/**
	 * @class -- Promise
	 * @desc  -- Promise A+ 模型实现
	 */
	function Promise(state) {
		if (!(this instanceof Promise)) {
			return new Promise(1);
		}

		//-- promise modle
		//== promise 三状态 pending(默认状态) ,fulfilled, rejected
		this._resolves = [];
		this._rejects = [];
		this._readyState = state || Promise.PENDING;
		this._data = null;
		this._reason = null;
	}
	
	mix(Promise, {
		PENDING: 0,
		FULFILLED: 1,
		REJECTED: 2,
		isPromise: function(obj) {
			return obj != null && typeof obj['then'] == 'function';
		}
	});

	/**
	 * @class -- Defer
	 * @desc  -- 负责promise的resolve和reject
	 */
	function Defer() {
		this.promise = new Promise();
	}

	Defer.prototype = {
		resolve: function(data) {
			var promise = this.promise;
			if (promise._readyState != Promise.PENDING) {
				return;
			}

			promise._readyState = Promise.FULFILLED;
			promise._data = data;

			promise._resolves.forEach(function(handler) {
				handler(data);
			});
		},
		reject: function(reason) {
			var promise = this.promise;
			if (promise._readyState != Promise.PENDING) {
				return;
			}
			promise._readyState = Promise.REJECTED;
			promise._reason = reason;

			var handler = promise._rejects[0];
			if (handler) {
				handler(reason);
			}
		}
	};

	function mix(a, b) {
		for (attr in b) {
			a[attr] = b[attr];
		}
	}

	var PromiseProto = Promise.prototype;
	PromiseProto.then = function(onFulfilled, onRejected) {
		var deferred = new Defer();


		if (this._readyState === Promise.PENDING) {
			this._resolves.push(fulfill);

			if (onRejected) {
				this._rejects.push(onRejected);
			} else {
				//为了让reject向后传递 
				this._rejects.push(function(reason) {
					deferred.reject(reason);
				});
			}
			return deferred.promise;
		} else if (this._readyState === Promise.FULFILLED) {
			var self = this;
			return fulfill(self._data);
		}

		function fulfill(data) {
			var ret = onFulfilled ? onFulfilled(data) : data;
			if (Promise.isPromise(ret)) {
				ret.then(function(data) {
					deferred.resolve(data);
				});
				return deferred.promise
			} else {
				deferred.resolve(ret);
				return ret;
			}
		}
	}

	PromiseProto.otherwise = function(onRejected) {
		return this.then(undefined, onRejected);
	}

	PromiseProto.defer = function(){
		return new Defer();
	}

	PromiseProto.all = function(promises){
		var defer = new Defer();
		var n = 0, result = [];
		//--solver 里边的n表示完成的个数
		promises.forEach(function(promise){
			promise.then(function(ret){
				result.push(ret);
				if(n++ >= promises.length) {
					defer.resolve(result);
				}
			});
		});
		return defer.promise;
	}

	PromiseProto.any = function(promises){
		var defer = new Defer();
		promises.forEach(function(promise){
			promise.then(function(ret){
				defer.resolve(ret);
			});
		});
		return defer.promise;
	}

	module.exports = {
		Promise: Promise,
		Defer: Defer
	};
});