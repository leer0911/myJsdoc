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


/**
 * @func
 * @returns {boolean} 返回值为true
 */
function foo() {
    return true;
}


/**
 * @namespace
 */
var $ = {
}

/**
 * @desc 这是一个变量
 */
var foo;

/**
 * @func
 * @desc 计算两个数值的和
 * @param {number} a - 加数a
 * @param {number} b - 加数b
 * @returns {number} 返回a和b的和
 * @example
 * add(1, 2);    // 返回3
 */
function add(a, b) {
    return a + b;
}

/**
 * @func
 * @todo 这个函数需要优化
 */
function todo() {
}


/**
 * @callback myCallback
 * @desc 这是自定义的type
 * @param {number} a - 参数a
 * @returns {boolean} 返回值
 */
function myCallback(a) {
    return true;
}

/**
 * @func
 * @param {myCallback} a - 参数a是一个回调函数
 */
function myCallbackFN(a) {
}
