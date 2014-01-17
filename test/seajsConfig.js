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
		"matches": "lib/matches.js",
		"simulate": "lib/jquery.simulate.js",
		"expect": "lib/expect.js",
		"_": "lib/underscore.js",
		"robot": "robot.js",
		'asyn': 'asyn.js',
		'asynTaskQueue': 'asynTaskQueue.js',
		"IA": "IA.js",
		"reporter": "reporter.js",
		"util": "util.js",
		'spy': 'spy.js',
		"spec": "spec.js",
		"suit": "suit.js",
		"cobble": "cobble.js"
	}
});