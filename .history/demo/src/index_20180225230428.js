/**
 * @type {number}
 */
var foo1;

/**
 * @type {*}
 * @desc 任何类型
 */
var foo2;

/**
 * @type {?string}
 * @desc string或者null
 */
var foo3;

/**
 * @type {!string}
 * @desc string且不能为null
 */
var foo4;

/**
 * @type {boolean[]}
 * @desc boelean数组
 */
var foo5;

/**
 * @type {(number|string)}
 * @desc number或者string
 */
var foo6;

/**
 * @type {object}
 * @desc 对象
 * @property {string} a - 属性a
 */
var foo7 = {
    a: 'a'
};


/**
 * @func
 * @desc 一个带参数的函数
 * @param {string} a - 参数a
 * @param {number} b=1 - 参数b默认值为1
 * @param {string} c=1 - 参数c有两种支持的取值</br>1—表示x</br>2—表示xx
 * @param {object} d - 参数d为一个对象
 * @param {string} d.e - 参数d的e属性
 * @param {string} d.f - 参数d的f属性
 * @param {object[]} g - 参数g为一个对象数组
 * @param {string} g.h - 参数g数组中一项的h属性
 * @param {string} g.i - 参数g数组中一项的i属性
 * @param {string} [j] - 参数j是一个可选参数
 */
function foo(a, b, c, d, g, j) { }

/**
 * @func
 * @desc 一个带若干参数的函数
 * @param {...string} a - 参数a
 */
function bar(a) { }
