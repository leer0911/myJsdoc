/**
 * @file dom.js
 * @module dom
 */
import document from 'global/document';
import window from 'global/window';
import log from './log.js';
import tsml from 'tsml';
import { isObject } from './obj';
import computedStyle from './computed-style';
import * as browser from './browser';

/**
 * 检查字符串是否没有空格
 *
 * @param {string} str
 *        The string to check
 *
 * @return {boolean}
 *         - True if the string is non-blank
 *         - False otherwise
 *
 */
function isNonBlankString(str) {
    return typeof str === 'string' && /\S/.test(str);
}

/**
 * 如果字符串有空格则抛出错误。用于让类方法和classList API 保持一致
 *
 * @param {string} str
 *         The string to check for whitespace.
 *
 * @throws {Error}
 *         Throws an error if there is whitespace in the string.
 *
 */
function throwIfWhitespace(str) {
    if (/\s/.test(str)) {
        throw new Error('class has illegal whitespace characters');
    }
}

/**
 * 生成匹配元素className的正则表达式
 *
 * @param {string} className
 *         The className to generate the RegExp for.
 *
 * @return {RegExp}
 *         The RegExp that will check for a specific `className` in an elements
 *         className.
 */
function classRegExp(className) {
    return new RegExp('(^|\\s)' + className + '($|\\s)');
}

/**
 * 检查当前DOM是否为真实的DOM接口
 *
 * @return {Boolean}
 */
export function isReal() {
    return (
        // Both document and window will never be undefined thanks to `global`.
        document === window.document &&
        // In IE < 9, DOM methods return "object" as their type, so all we can
        // confidently check is that it exists.
        typeof document.createElement !== 'undefined'
    );
}

/**
 * 用过鸭子类型检查是否为DOM元素
 *
 * @param {Mixed} value
 *        The thing to check
 *
 * @return {boolean}
 *         - True if it is a DOM element
 *         - False otherwise
 */
export function isEl(value) {
    return isObject(value) && value.nodeType === 1;
}

/**
 * 检查当前DOM是否在iframe
 *
 * @return {boolean}
 *
 */
export function isInFrame() {
    // We need a try/catch here because Safari will throw errors when attempting
    // to get either `parent` or `self`
    try {
        return window.parent !== window.self;
    } catch (x) {
        return true;
    }
}

/**
 * 通过传入的方法来查询DOM
 *
 * @param {string} method
 *         The method to create the query with.
 *
 * @return {Function}
 *         The query method
 */
function createQuerier(method) {
    return function(selector, context) {
        if (!isNonBlankString(selector)) {
            return document[method](null);
        }
        if (isNonBlankString(context)) {
            context = document.querySelector(context);
        }

        const ctx = isEl(context) ? context : document;

        return ctx[method] && ctx[method](selector);
    };
}

/**
 * 用所给属性创建元素
 *
 * @param {string} [tagName='div']
 *         Name of tag to be created.
 *
 * @param {Object} [properties={}]
 *         Element properties to be applied.
 *
 * @param {Object} [attributes={}]
 *         Element attributes to be applied.
 *
 * @param {String|Element|TextNode|Array|Function} [content]
 *         Contents for the element (see: {@link dom:normalizeContent})
 *
 * @return {Element}
 *         The element that was created.
 */
export function createEl(
    tagName = 'div',
    properties = {},
    attributes = {},
    content
) {
    const el = document.createElement(tagName);

    Object.getOwnPropertyNames(properties).forEach(function(propName) {
        const val = properties[propName];

        // See #2176
        // We originally were accepting both properties and attributes in the
        // same object, but that doesn't work so well.
        if (
            propName.indexOf('aria-') !== -1 ||
            propName === 'role' ||
            propName === 'type'
        ) {
            log.warn(tsml`Setting attributes in the second argument of createEl()
                has been deprecated. Use the third argument instead.
                createEl(type, properties, attributes). Attempting to set ${propName} to ${val}.`);
            el.setAttribute(propName, val);

            // Handle textContent since it's not supported everywhere and we have a
            // method for it.
        } else if (propName === 'textContent') {
            textContent(el, val);
        } else {
            el[propName] = val;
        }
    });

    Object.getOwnPropertyNames(attributes).forEach(function(attrName) {
        el.setAttribute(attrName, attributes[attrName]);
    });

    if (content) {
        appendContent(el, content);
    }

    return el;
}

/**
 * 把文本插入元素，并且替换所有已存在的内容
 *
 * @param {Element} el
 *        The element to add text content into
 *
 * @param {string} text
 *        The text content to add.
 *
 * @return {Element}
 *         The element with added text content.
 */
export function textContent(el, text) {
    if (typeof el.textContent === 'undefined') {
        el.innerText = text;
    } else {
        el.textContent = text;
    }
    return el;
}

/**
 * 在父元素向前插入子元素
 *
 * @param {Element} child
 *        Element to insert
 *
 * @param {Element} parent
 *        Element to insert child into
 */
export function prependTo(child, parent) {
    if (parent.firstChild) {
        parent.insertBefore(child, parent.firstChild);
    } else {
        parent.appendChild(child);
    }
}

/**
 * 检查元素是否有css class
 *
 * @param {Element} element
 *        Element to check
 *
 * @param {string} classToCheck
 *        Class name to check for
 *
 * @return {boolean}
 *         - True if the element had the class
 *         - False otherwise.
 *
 * @throws {Error}
 *         Throws an error if `classToCheck` has white space.
 */
export function hasClass(element, classToCheck) {
    throwIfWhitespace(classToCheck);
    if (element.classList) {
        return element.classList.contains(classToCheck);
    }
    return classRegExp(classToCheck).test(element.className);
}

/**
 * 给元素加对应class
 *
 * @param {Element} element
 *        Element to add class name to.
 *
 * @param {string} classToAdd
 *        Class name to add.
 *
 * @return {Element}
 *         The dom element with the added class name.
 */
export function addClass(element, classToAdd) {
    if (element.classList) {
        element.classList.add(classToAdd);

        // Don't need to `throwIfWhitespace` here because `hasElClass` will do it
        // in the case of classList not being supported.
    } else if (!hasClass(element, classToAdd)) {
        element.className = (element.className + ' ' + classToAdd).trim();
    }

    return element;
}

/**
 * 移除元素对应class
 *
 * @param {Element} element
 *        Element to remove a class name from.
 *
 * @param {string} classToRemove
 *        Class name to remove
 *
 * @return {Element}
 *         The dom element with class name removed.
 */
export function removeClass(element, classToRemove) {
    if (element.classList) {
        element.classList.remove(classToRemove);
    } else {
        throwIfWhitespace(classToRemove);
        element.className = element.className
            .split(/\s+/)
            .filter(function(c) {
                return c !== classToRemove;
            })
            .join(' ');
    }

    return element;
}

/**
 * 自定义 判断toggleElClass 的回调
 *
 * @callback Dom~PredicateCallback
 * @param {Element} element
 *        The DOM element of the Component.
 *
 * @param {string} classToToggle
 *        The `className` that wants to be toggled
 *
 * @return {boolean|undefined}
 *         - If true the `classToToggle` will get added to `element`.
 *         - If false the `classToToggle` will get removed from `element`.
 *         - If undefined this callback will be ignored
 */

/**
 * 通过判断class是否存在来给元素添加或移除对应类
 *
 * @param {Element} element
 *        The element to toggle a class name on.
 *
 * @param {string} classToToggle
 *        The class that should be toggled
 *
 * @param {boolean|PredicateCallback} [predicate]
 *        See the return value for {@link Dom~PredicateCallback}
 *
 * @return {Element}
 *         The element with a class that has been toggled.
 */
export function toggleClass(element, classToToggle, predicate) {
    // This CANNOT use `classList` internally because IE does not support the
    // second parameter to the `classList.toggle()` method! Which is fine because
    // `classList` will be used by the add/remove functions.
    const has = hasClass(element, classToToggle);

    if (typeof predicate === 'function') {
        predicate = predicate(element, classToToggle);
    }

    if (typeof predicate !== 'boolean') {
        predicate = !has;
    }

    // If the necessary class operation matches the current state of the
    // element, no action is required.
    if (predicate === has) {
        return;
    }

    if (predicate) {
        addClass(element, classToToggle);
    } else {
        removeClass(element, classToToggle);
    }

    return element;
}

/**
 * 给元素设置属性
 *
 * @param {Element} el
 *        Element to add attributes to.
 *
 * @param {Object} [attributes]
 *        Attributes to be applied.
 */
export function setAttributes(el, attributes) {
    Object.getOwnPropertyNames(attributes).forEach(function(attrName) {
        const attrValue = attributes[attrName];

        if (
            attrValue === null ||
            typeof attrValue === 'undefined' ||
            attrValue === false
        ) {
            el.removeAttribute(attrName);
        } else {
            el.setAttribute(attrName, attrValue === true ? '' : attrValue);
        }
    });
}

/**
 * 获取元素所有属性值，对于Boolean属性则返回true或false
 *
 * @param {Element} tag
 *        Element from which to get tag attributes.
 *
 * @return {Object}
 *         All attributes of the element.
 */
export function getAttributes(tag) {
    const obj = {};

    // known boolean attributes
    // we can check for matching boolean properties, but older browsers
    // won't know about HTML5 boolean attributes that we still read from
    const knownBooleans =
        ',' +
        'autoplay,controls,playsinline,loop,muted,default,defaultMuted' +
        ',';

    if (tag && tag.attributes && tag.attributes.length > 0) {
        const attrs = tag.attributes;

        for (let i = attrs.length - 1; i >= 0; i--) {
            const attrName = attrs[i].name;
            let attrVal = attrs[i].value;

            // check for known booleans
            // the matching element property will return a value for typeof
            if (
                typeof tag[attrName] === 'boolean' ||
                knownBooleans.indexOf(',' + attrName + ',') !== -1
            ) {
                // the value of an included boolean attribute is typically an empty
                // string ('') which would equal false if we just check for a false value.
                // we also don't want support bad code like autoplay='false'
                attrVal = attrVal !== null ? true : false;
            }

            obj[attrName] = attrVal;
        }
    }

    return obj;
}

/**
 * 获取元素对应属性值
 *
 * @param {Element} el
 *        A DOM element
 *
 * @param {string} attribute
 *        Attribute to get the value of
 *
 * @return {string}
 *         value of the attribute
 */
export function getAttribute(el, attribute) {
    return el.getAttribute(attribute);
}

/**
 * 设置属性值
 *
 * @param {Element} el
 *        A DOM element
 *
 * @param {string} attribute
 *        Attribute to set
 *
 * @param {string} value
 *        Value to set the attribute to
 */
export function setAttribute(el, attribute, value) {
    el.setAttribute(attribute, value);
}

/**
 * 移除属性值
 *
 * @param {Element} el
 *        A DOM element
 *
 * @param {string} attribute
 *        Attribute to remove
 */
export function removeAttribute(el, attribute) {
    el.removeAttribute(attribute);
}

/**
 * 拖动控件时阻止选择文本
 */
export function blockTextSelection() {
    document.body.focus();
    document.onselectstart = function() {
        return false;
    };
}

/**
 * 取消禁用文本选择
 */
export function unblockTextSelection() {
    document.onselectstart = function() {
        return true;
    };
}

/**
 * 类似原生`getBoundingClientRect` 方法，使用前考虑兼容性。不支持老浏览器如IE8。
 * 另外，一些浏览器不支持给 `ClientRect` / `DOMRect` 对象添加属性。通过浅拷贝标准属性(除了像 `x` `y` 这种广泛支持的属性) 来实现。
 *
 * @param  {Element} el
 *         Element whose `ClientRect` we want to calculate.
 *
 * @return {Object|undefined}
 *         Always returns a plain
 */
export function getBoundingClientRect(el) {
    if (el && el.getBoundingClientRect && el.parentNode) {
        const rect = el.getBoundingClientRect();
        const result = {};

        ['bottom', 'height', 'left', 'right', 'top', 'width'].forEach(k => {
            if (rect[k] !== undefined) {
                result[k] = rect[k];
            }
        });

        if (!result.height) {
            result.height = parseFloat(computedStyle(el, 'height'));
        }

        if (!result.width) {
            result.width = parseFloat(computedStyle(el, 'width'));
        }

        return result;
    }
}

/**
 * 获取DOM元素在界面中的位置信息
 *
 * @typedef {Object} module:dom~Position
 *
 * @property {number} left
 *           Pixels to the left
 *
 * @property {number} top
 *           Pixels on top
 */

/**
 * Offset Left.
 * getBoundingClientRect technique from
 * John Resig
 *
 * @see http://ejohn.org/blog/getboundingclientrect-is-awesome/
 *
 * @param {Element} el
 *        Element from which to get offset
 *
 * @return {module:dom~Position}
 *         The position of the element that was passed in.
 */
export function findPosition(el) {
    let box;

    if (el.getBoundingClientRect && el.parentNode) {
        box = el.getBoundingClientRect();
    }

    if (!box) {
        return {
            left: 0,
            top: 0
        };
    }

    const docEl = document.documentElement;
    const body = document.body;

    const clientLeft = docEl.clientLeft || body.clientLeft || 0;
    const scrollLeft = window.pageXOffset || body.scrollLeft;
    const left = box.left + scrollLeft - clientLeft;

    const clientTop = docEl.clientTop || body.clientTop || 0;
    const scrollTop = window.pageYOffset || body.scrollTop;
    const top = box.top + scrollTop - clientTop;

    // Android sometimes returns slightly off decimal values, so need to round
    return {
        left: Math.round(left),
        top: Math.round(top)
    };
}

/**
 * x and y coordinates for a dom element or mouse pointer
 *
 * @typedef {Object} Dom~Coordinates
 *
 * @property {number} x
 *           x coordinate in pixels
 *
 * @property {number} y
 *           y coordinate in pixels
 */

/**
 * 基于元素的bottom和left坐标，获取鼠标在元素中的位置信息，返回一个包含x和y的坐标对象。
 *
 * @param {Element} el
 *        Element on which to get the pointer position on
 *
 * @param {EventTarget~Event} event
 *        Event object
 *
 * @return {Dom~Coordinates}
 *         A Coordinates object corresponding to the mouse position.
 *
 */
export function getPointerPosition(el, event) {
    const position = {};
    const box = findPosition(el);
    const boxW = el.offsetWidth;
    const boxH = el.offsetHeight;

    const boxY = box.top;
    const boxX = box.left;
    let pageY = event.pageY;
    let pageX = event.pageX;

    if (event.changedTouches) {
        pageX = event.changedTouches[0].pageX;
        pageY = event.changedTouches[0].pageY;
    }

    position.y = Math.max(0, Math.min(1, (boxY - pageY + boxH) / boxH));
    position.x = Math.max(0, Math.min(1, (pageX - boxX) / boxW));

    return position;
}

/**
 * 通过鸭子类型来判断是否为文本节点
 *
 * @param {Mixed} value
 *        Check if this value is a text node.
 *
 * @return {boolean}
 *         - True if it is a text node
 *         - False otherwise
 */
export function isTextNode(value) {
    return isObject(value) && value.nodeType === 3;
}

/**
 * 清空元素内容
 *
 * @param {Element} el
 *        The element to empty children from
 *
 * @return {Element}
 *         The element with no children
 */
export function emptyEl(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
    return el;
}

/**
 * 格式化插入DOM的内容
 * 防止用`innerHTML`造成的xss攻击
 * 内容可以多种类型和组合，如下
 *
 * @param {String|Element|TextNode|Array|Function} content
 *        - String: Normalized into a text node.
 *        - Element/TextNode: Passed through.
 *        - Array: A one-dimensional array of strings, elements, nodes, or functions
 *          (which return single strings, elements, or nodes).
 *        - Function: If the sole argument, is expected to produce a string, element,
 *          node, or array as defined above.
 *
 * @return {Array}
 *         All of the content that was passed in normalized.
 */
export function normalizeContent(content) {
    // First, invoke content if it is a function. If it produces an array,
    // that needs to happen before normalization.
    if (typeof content === 'function') {
        content = content();
    }

    // Next up, normalize to an array, so one or many items can be normalized,
    // filtered, and returned.
    return (Array.isArray(content) ? content : [content])
        .map(value => {
            // First, invoke value if it is a function to produce a new value,
            // which will be subsequently normalized to a Node of some kind.
            if (typeof value === 'function') {
                value = value();
            }

            if (isEl(value) || isTextNode(value)) {
                return value;
            }

            if (typeof value === 'string' && /\S/.test(value)) {
                return document.createTextNode(value);
            }
        })
        .filter(value => value);
}

/**
 * 格式化文本并添加到元素
 *
 * @param {Element} el
 *        Element to append normalized content to.
 *
 *
 * @param {String|Element|TextNode|Array|Function} content
 *        See the `content` argument of {@link dom:normalizeContent}
 *
 * @return {Element}
 *         The element with appended normalized content.
 */
export function appendContent(el, content) {
    normalizeContent(content).forEach(node => el.appendChild(node));
    return el;
}

/**
 * 格式化内容，先清空再插入到元素
 * Normalizes and inserts content into an element; this is identical to
 * `appendContent()`, except it empties the element first.
 *
 * @param {Element} el
 *        Element to insert normalized content into.
 *
 * @param {String|Element|TextNode|Array|Function} content
 *        See the `content` argument of {@link dom:normalizeContent}
 *
 * @return {Element}
 *         The element with inserted normalized content.
 *
 */
export function insertContent(el, content) {
    return appendContent(emptyEl(el), content);
}

/**
 * 检查是否为左键单击
 *
 * @param {EventTarget~Event} event
 *        Event object
 *
 * @return {boolean}
 *         - True if a left click
 *         - False if not a left click
 */
export function isSingleLeftClick(event) {
    // Note: if you create something draggable, be sure to
    // call it on both `mousedown` and `mousemove` event,
    // otherwise `mousedown` should be enough for a button

    if (event.button === undefined && event.buttons === undefined) {
        // Why do we need `butttons` ?
        // Because, middle mouse sometimes have this:
        // e.button === 0 and e.buttons === 4
        // Furthermore, we want to prevent combination click, something like
        // HOLD middlemouse then left click, that would be
        // e.button === 0, e.buttons === 5
        // just `button` is not gonna work

        // Alright, then what this block does ?
        // this is for chrome `simulate mobile devices`
        // I want to support this as well

        return true;
    }

    if (event.button === 0 && event.buttons === undefined) {
        // Touch screen, sometimes on some specific device, `buttons`
        // doesn't have anything (safari on ios, blackberry...)

        return true;
    }

    if (browser.IE_VERSION === 9) {
        // Ignore IE9

        return true;
    }

    if (event.button !== 0 || event.buttons !== 1) {
        // This is the reason we have those if else block above
        // if any special case we can catch and let it slide
        // we do it above, when get to here, this definitely
        // is-not-left-click

        return false;
    }

    return true;
}

/**
 * 用匹配选择器获取单个DOM元素，依赖于其他DOM的 `context`，默认为 `document`
 *
 * @param {string} selector
 *        A valid CSS selector, which will be passed to `querySelector`.
 *
 * @param {Element|String} [context=document]
 *        A DOM element within which to query. Can also be a selector
 *        string in which case the first matching element will be used
 *        as context. If missing (or no element matches selector), falls
 *        back to `document`.
 *
 * @return {Element|null}
 *         The element that was found or null.
 */
export const $ = createQuerier('querySelector');

/**
 * 获取所有匹配选择器的元素
 *
 * @param {string} selector
 *           A valid CSS selector, which will be passed to `querySelectorAll`.
 *
 * @param {Element|String} [context=document]
 *           A DOM element within which to query. Can also be a selector
 *           string in which case the first matching element will be used
 *           as context. If missing (or no element matches selector), falls
 *           back to `document`.
 *
 * @return {NodeList}
 *         A element list of elements that were found. Will be empty if none were found.
 *
 */
export const $$ = createQuerier('querySelectorAll');
