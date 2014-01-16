/**
 * @module event dispatcher
 */
define(function(require, exports, module) {
	var _ = require('_');

	var EventSimulator = {};
	var mouseEventArr = "dblclick,click,mousedown,mouseup,mouseout,mouseover".split(',');
	var htmlEventArr = "abort,blur,change,error,focus,load,reset,resize,scroll,select".split(',');
	var keyEvetArr = "keyup,keydown,keypress".split(',');

	//--初始化鼠标事件模拟
	_.forEach(mouseEventArr, function(type) {
		EventSimulator['simulate' + type] = function(x, y) {
			simulateMouseEvent(type, x, y);
		};
	});

	//--初始化键盘事件
	_.forEach(keyEvetArr, function(type) {
		EventSimulator['simulate' + type] = function(code) {
			simulateKeyEvent(type, code);
		}
	});

	//--初始化HTML元素事件
	_.forEach(htmlEventArr, function(type){
		EventSimulator['simulate' + type] = function(el){
			simulateHtmlEvent(type, el);
		}
	});

	function simulateMouseEvent(type, x, y) {
		var el = getElementFromPoint(x, y);
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent(type, true, true, window,
			1, 0, 0,
			x - getElementLeft(el), y - getElementTop(el),
			false, false, false, false, 0, null);

		el.dispatchEvent(evt);
	}


	function simulateKeyEvent(type, code) {
		var evt = document.createEvent("KeyboardEvent");
		var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
		// keydown, keyup, keypress
		evt[initMethod](type, true, true, window,
			0, 0, 0, 0,
			0, code.charCodeAt(0))
		document.body.dispatchEvent(evt);
	}

	function simulateHtmlEvent(type, el) {
		var evt; 
		if (document.createEvent) {
			evt = document.createEvent("HTMLEvents");
			evt.initEvent(type, true, true);
		} else {
			evt = document.createEventObject();
			evt.eventType = type;
		}
		evt.eventName = type;
		if (document.createEvent) {
			el.dispatchEvent(evt);
		} else {
			el.fireEvent("on" + evt.eventType, evt);
		}
	}


	function getElementFromPoint(x, y) {
		return document.elementFromPoint(x, y);
	}

	function getViewport() {　　　　
		if (document.compatMode == "BackCompat") {　　　　　　
			return {　　　　　　　　
				width: document.body.clientWidth,
				height: document.body.clientHeight　　　　　　
			}　　　　
		} else {　　　　　　
			return {　　　　　　　　
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight　　　　　　
			}　　　　
		}　　
	}

	function getPagearea() {　　　　
		if (document.compatMode == "BackCompat") {　　　　　　
			return {　　　　　　　　
				width: Math.max(document.body.scrollWidth, document.body.clientWidth),
				height: Math.max(document.body.scrollHeight, document.body.clientHeight)　　　　　　
			}　　　　
		} else {　　　　　　
			return {　　　　　　　　
				width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
				height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)　　　　　　
			}　　　　
		}　　
	}

	function getElementLeft(element) {　　　　
		var actualLeft = element.offsetLeft;　　　　
		var current = element.offsetParent;　　　　
		while (current !== null) {　　　　　　
			actualLeft += current.offsetLeft;　　　　　　
			current = current.offsetParent;　　　　
		}　　　　
		return actualLeft;　　
	}

	　　

	function getElementTop(element) {　　　　
		var actualTop = element.offsetTop;　　　　
		var current = element.offsetParent;　　　　
		while (current !== null) {　　　　　　
			actualTop += current.offsetTop;　　　　　　
			current = current.offsetParent;　　　　
		}　　　　
		return actualTop;　　
	}

	function getElementViewLeft(element) {　　　　
		var actualLeft = element.offsetLeft;　　　　
		var current = element.offsetParent;　　　　
		while (current !== null) {　　　　　　
			actualLeft += current.offsetLeft;　　　　　　
			current = current.offsetParent;　　　　
		}　　　　
		if (document.compatMode == "BackCompat") {　　　　　　
			var elementScrollLeft = document.body.scrollLeft;　　　　
		} else {　　　　　　
			var elementScrollLeft = document.documentElement.scrollLeft;　　　　
		}　　　　
		return actualLeft - elementScrollLeft;　　
	}

	　　

	function getElementViewTop(element) {　　　　
		var actualTop = element.offsetTop;　　　　
		var current = element.offsetParent;　　　　
		while (current !== null) {　　　　　　
			actualTop += current.offsetTop;　　　　　　
			current = current.offsetParent;　　　　
		}　　　　
		if (document.compatMode == "BackCompat") {　　　　　　
			var elementScrollTop = document.body.scrollTop;　　　　
		} else {　　　　　　
			var elementScrollTop = document.documentElement.scrollTop;　　　　
		}　　　　
		return actualTop - elementScrollTop;　　
	}

	module.exports = EventSimulator;
});