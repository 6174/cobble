seajs.config({
	base: "../src/",
	// 设置路径，方便跨目录调用
	paths: {
		'lib': 'lib',
		'js': 'javascripts',
		'css': 'stylesheets'
	},

	alias: {
		"jquery": "lib/jquery.js",
		"when": "lib/when.js",
		"expect": "lib/expect.js",
		"_": "lib/underscore.js",
		"robot": "robot.js",
		"util": "util.js",
		'spy': 'spy.js',
		'asyn': 'asyn.js',
		'asynTaskQueue': 'asynTaskQueue.js'
	}
});