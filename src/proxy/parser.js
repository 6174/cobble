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
 * 在ast里边目前有两种情况：
 *  1. FunctionDeclaration: 
 				eg：
 				 function add(){}
 		   这个时候的处理应该为在其后面添加一个spystatement
 		   编译过后应该为
 		     function add(){}
 		     spy(add, '*.add');
 		2. FunctionExpression, 匿名函数可以在任何表达式上面出现， 要把这个值替换
 		  为spy(function(){}, '**.$f*');
 */

//--requires
var _ = require('underscore');
var util = require('util');
var esprima = require('esprima');
var escodegen = require('escodegen');
var estraverse = require('estraverse');

//--users
var anonymouseScopeCounter = 0;
var fileName;

//--每个模块的， 可以设定为fileName
var moduleName = '';
var blockNameStack = [];
var options = {
	insSpyName: 'spy'
};


function injectInstrument(syntax) {
	console.log('***************************before\n');
	// console.log(util.inspect(syntax.body, false, 10));
	// console.log(escodegen.generate(syntax));
	estraverse.traverse(syntax, {
		enter: function(node, parent) {
			if (node.type == "Program") {
				blockNameStack.push(moduleName);
			} else if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
				if (node.id === null) {
					node.id = getAnonymouseScopeId();
				}
				blockNameStack.push(node.id.name);
			}
		},
		leave: function(node, parent) {
			var blockName = blockNameStack.join('.');
			if (node.type === 'FunctionExpression') {
				console.log('functionExpression: ' + blockName);
				blockNameStack.pop();
				for(attr in parent){
					if(parent[attr] === node){
						parent[attr] = getSpyExpression(node, blockName)
						return;
					}
				}
				if(parent.type === 'CallExpression'){
					var index = parent.arguments.indexOf(node);
					parent.arguments[index] = getSpyExpression(node, blockName);
				}

			} else if (node.type === 'FunctionDeclaration') {
				console.log('FunctionDeclaration: ' + blockName);
				blockNameStack.pop();
				// console.log(parent);
				if (parent.body) {
					var indexOfNode = parent.body.indexOf(node);
					parent.body.splice(indexOfNode, 0, getSpyExpressionStatement(node.id.name, blockName));
				}
			}
		}
	});

	console.log('***************************after\n');
	// console.log(util.inspect(syntax.body, false, 10));
	console.log(escodegen.generate(syntax));
	return syntax;
}



function getAnonymouseScopeId() {
	return {
		"type": "Identifier",
		"name": '$f' + anonymouseScopeCounter++
	}
}

function getSpyExpressionStatement(name, id) {
	return {
		"type": "ExpressionStatement",
		"expression": {
			"type": "CallExpression",
			"callee": {
				"type": "Identifier",
				"name": "spy"
			},
			"arguments": [{
				"type": "Identifier",
				"name": name
			}, {
				"type": "Literal",
				"value": id,
				"raw": "'" + id + "'"
			}]
		}
	}
}

function getSpyExpression(functionExpression, id) {
	return {
		"type": "CallExpression",
		"callee": {
			"type": "Identifier",
			"name": "spy"
		},
		"arguments": [
			functionExpression, {
				"type": "Literal",
				"value": id,
				"raw": "'" + id + "'"
			}
		]
	}
}

function test() {
	var code = "var a = function (b){ return function c(){}; } ";
	code = require('fs').readFileSync('./test/parser_test_file.js');
	var syntax = esprima.parse(code, {
		tolerant: true,
		loc: false,
		range: false
	});
	return injectInstrument(syntax);
}
test();