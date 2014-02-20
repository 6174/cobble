/**
 * cobble parser
 * @author: 6174
 * @desc: 
 *   -- 对加载的js文件进行重编译
 *   -- 获取全局的模块的函数名称
 *   -- todo： 获取函数内的条件判断序号
 *   -- 函数的全局名称有两种方式设定
 *		 1. 命名函数函数名: 唯一的函数名
 *       2. 匿名函数： parser帮助加上函数名
 *   -- 设定方式是通过层级关系递归设定， 子函数的全局名会加上父级的函数名
 *   -- 匿名函数通过一个序号顺序设定, $f1, $f2, $f3这样访问, 序号一直累加
 *   -- example:
         1. MyClass.$f1.doAdd
         2. $f2.helloWorld.doAdd
     -- 用户可以通过sublime类似的fuzzy search：
         spy('MyClass.doAdd'),
         spy('helloWorld.doAdd')
 *   
 */

//--requires
var _ = require('underscore');
var esprima = require('esprima');
var escodegen = require('escodegen');

//--users
var anonymouseScopeCounter = 0;
var fileName;
var options = {
	insSpyName: 'spy'
};


function injectInstrument(syntax) {
	traverse(syntax, traverser);
	return syntax;
}

function traverser(node) {
	if (node.type === 'ConditionalExpression') {
		checkConditional(node);
	}
}

function checkConditional(node) {
	var condition;

	if (node.consequent.type === 'ConditionalExpression' ||
		node.alternate.type === 'ConditionalExpression') {

		condition = content.substring(node.test.range[0], node.test.range[1]);
		if (condition.length > 20) {
			condition = condition.substring(0, 20) + '...';
		}
		condition = '"' + condition + '"';
		report(node, 'Nested ternary for ' + condition);
	}
}

// Executes visitor on the object and its children (recursively).
function traverse(object, visitor) {
	var key, child;

	visitor.call(null, object);
	for (key in object) {
		if (object.hasOwnProperty(key)) {
			child = object[key];
			if (typeof child === 'object' && child !== null) {
				traverse(child, visitor);
			}
		}
	}
}

function getAnonymouseScopeName() {
	return '$f' + anonymouseScopeCounter++;
}


function test() {
	var syntax = esprima.parse("var name = 'hello world';", {
		tolerant: true,
		loc: true,
		range: true
	});
	return injectInstrument(syntax);
}
test();