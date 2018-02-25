## jsdoc

### @file
对文件的描述，用于文件的头部

### @author `<name> [<emailAddress>]`
代码的作者
在姓名后面用尖括号加上邮箱会被自动转成 mailto: 的链接

### @copyright `<some copyright text>`
与@file结合使用，说明版权相关的信息

### @license `<identifier>`
说明许可证相关的信息

### @type `{typeName}`
'*'表示任何类型

'?'表示可以为null

'!'表示不能为null

数组用'[]'表示

类型有多种情况需用'|'进行分隔，并加上'()'

可以使用 @callback 或 @typedef 定义的类型

### @property `[<type>] [<name>] [some description]`
描述对象的属性

### @func `[<FunctionName>]`
标识一个函数

### @param `{<type>} name - some description`
非必传参数需给参数名加上'[]'

参数如有默认值需用'='表示

如果参数是object，可继续用 @param 对其属性进行详细说明

若干个参数用'...'表示

### @returns `{<type>} some description`
描述一个函数的返回值

### @namespace `[{<type>}] <SomeName>]`
标识一个命名空间

### @desc `<some description>`
对某个部分的详细描述和说明

### @summary `<some description>`
对某个部分的简短描述和说明

### @constant `[<type> <name>]`
标识常量

### @readonly
仅仅是注释，JSDoc不会去检查究竟是不是readonly

### @default `[<some value>]`
变量的初始值

### @enum `[<type>]`
相同类型的集合

注：
默认集合中的所有项都是相同类型，可以用@type指明某一项为其他类型

### @example
使用示例

示例代码在文档中会被高亮显示

### @throws `[{<type>} free-form description]`
表明这部分代码会抛出某个异常

### @todo text describing thing to do
后续需要做的事

### @borrows `<that namepath> as <this namepath>`
可理解为复制注释

当有多个地方引用了同一个函数，只需在一处写好注释，然后用@borrows即可

### @callback `<namepath>`
定义一个回调函数，和 @typedef 一样，是一种自定义类型

### @typedef `[<type>] <namepath>`
定义一个自定义类型

定义后可以在 @type @param 等标签中使用

### @this
说明此处 this 所指代的内容

### @global
全局标识

### @inner
内部属性或方法的标识，使用后可以通过 Parent~Child 的方式来引用

### @ignore
告诉JSDoc忽略这部分代码

### @version
版本号

### @since
表明该内容出现在一个特定的版本之后

### @class `[<type> <name>]`
标识一个函数为构造函数，可以用 new 的方式实例化

### @classdesc `<some description>`
与 @class 结合使用

注：
与 @desc 不同，@classdesc 是对类的描述，而 @desc 是对类的构造函数的描述

### @member `[<type>] [<name>]`
标识类的属性

### @method `[<FunctionName>]`
标识类的方法

### @public
标识类的属性或方法的访问范围是public

### @private
标识类的属性或方法的访问范围是private

### @protected
标识类的属性或方法的访问范围是protected

### @instance
实例属性或方法的标识

### @static
静态属性或方法的标识

### @constructs `<name>`
当使用对象直接量去定义类时，可以通过 @constructs 标识某个函数为类的构造函数

注：
不要和 @class同时使用,否则会在文档中出现两个同名的类

### @lends `<namepath>`
把对象直接量的属性和方法指定为某个类的属性和方法

### @extends `<namepath>`
用来表明继承关系

### @abstract
标识子类必须实现或重写父类的此方法

### @override
表明此方法是重写了父类的同名方法

### @interface `[<name>]`
定义接口

### @implements `{typeExpression}`
实现了某个接口

### @module `[[{<type>}] <moduleName>]`
定义一个模块

### @exports `<moduleName>`
当不是用 exports 或者 module.exports 对外提供模块接口时，需要使用 @exports 而不是 @module

### @requires `<someModuleName>`
需要某个模块

### @alias `<aliasNamepath>`
告诉JSDoc在生成文档时用另一个namepath去处理当前的内容

注：
### @alias 不同于 @name，@name会告诉JSDoc忽略这部分代码

### @name `<namepath>`
使用 @name 时，需要提供很多其他的注释，如 @type 等，因为JSDoc会忽略这部分代码

适用于在运行时才生成的函数等

### @inheritdoc
继承父类的注释

### @mixin `[<MixinName>]`
表明当前对象的属性和方法可以被添加到另一个对象中

### @mixes `<OtherObjectPath>`
将带有 @mixin 标签的对象的属性和方法添加进来

### @see `<namepath>`
页面里超链接的作用

`{@link namepath or url}`
可以理解为注释中内联的 @see
