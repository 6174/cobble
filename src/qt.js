(function() {

    var mix = function(a, b){
        for(attr in b){
            a[attr] = b[attr];
        }
    }
    var ArrayH = Array.prototype.forEach;

    function Promise() {
        this._resolves = [];
        this._rejects = [];
        this._readyState = Promise.PENDING;
        this._data = null;
        this._reason = null;
    }

    mix(Promise.prototype, {
        then: function(onFulfilled, onRejected) {
            var deferred = new Defer();

            function fulfill(data) {
                var ret = onFulfilled ? onFulfilled(data) : data;
                if (Promise.isPromise(ret)) {
                    ret.then(function(data) {
                        deferred.resolve(data);
                    });
                } else {
                    deferred.resolve(ret);
                }
                return ret;
            }

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
            } else if (this._readyState === Promise.FULFILLED) {
                var self = this;
                fulfill(self._data);
            }
            return deferred.promise;
        },
        otherwise: function(onRejected) {
            return this.then(undefined, onRejected);
        }
    });

    mix(Promise, {
        PENDING: 0,
        FULFILLED: 1,
        REJECTED: 2,
        isPromise: function(obj) {
            return obj != null && typeof obj['then'] == 'function';
        }
    });


    function Defer() {
        this.promise = new Promise();
    }

    mix(Defer.prototype, {
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
    });

    var a = {
        defer: function() {
            return new Defer();
        },
        isPromise: function(promiseOrValue) {
            return Promise.isPromise(promiseOrValue);
        },
        all: function(promises) {
            var deferred = QW.P.defer();

            var n = 0,
                result = [];
            ArrayH.forEach(promises, function(promise) {
                promise.then(function(ret) {
                    result.push(ret);
                    n++;

                    if (n >= promises.length) {
                        deferred.resolve(result);
                    }
                });
            });

            return deferred.promise;
        },
        any: function() {
            var deferred = QW.P.defer();

            ArrayH.forEach(promises, function(promise) {
                promise.then(function(ret) {
                    deferred.resolve(ret);
                });
            });

            return deferred.promise;
        }
    };

 

    function wait(seconds) {
        return function() {
            var defer = new Defer();
            setTimeout(function(){
                defer.resolve();
            } , seconds * 1000);
            return defer.promise;
        }
    }

    function log() {
        console.log(1);
    }

    wait(1)().then(log).then(wait(2)).then(log);

})();