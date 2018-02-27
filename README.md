# JSDoc Template

记得有大神说过，尽量不要注释，除了[JsDoc](http://usejsdoc.org/)。JsDoc 可以帮助我们通过 JsDoc 的注释风格快速生成 Api 文档。比如 [lodash](https://lodash.com/docs/4.17.5) 文档。

> JsDoc 可以让开发者养成良好的注释风格，并且可以让你注释和编写文档同步进行。

* [官方文档/英文](http://usejsdoc.org/)
* [中文参考](http://www.css88.com/doc/jsdoc/index.html)
* [github](https://github.com/jsdoc3/jsdoc)

## myJsDoc 模板预览

API 文档风格主要基于 `jsDoc Template` ，`myJsDoc` 就是其中衍生的一种风格。所有样式(包括代码风格) 均可自定义。

* 整体风格

![预览](https://github.com/leer0911/myJsdoc/raw/master/screenshot/a.png)

* markdown 风格 (github)

![预览](https://github.com/leer0911/myJsdoc/blob/master/screenshot/b.png)

## JsDoc 安装

```bash
 npm install -g jsdoc
```

在根目录新建 `jsdoc.json` 用于配置生成规则，如下 ( 具体配置可参考 [myJsDoc](https://github.com/leer0911/myJsdoc/tree/master/demo) )

```json
{
    "source": {
        // 需要生成文档的对应 js 路径
        "include": ["src/"],
        "includePattern": ".js$"
    },
    "opts": {
        "destination": "docs/", // 文档生成目录
        "readme": "docs/index.md", // 文档首页展示内容
        "template": "", // 文档模板
        "package": "package.json",
        "recurse": true,
        "tutorials": "docs/tutorials", // 生成教程内容
        "encoding": "utf8"
    },
    "templates": {
        // 模板配置，此处跟模板设置有关。
    },
    "plugins": ["plugins/markdown"],
    "markdown": {
        "tags": ["example"],
        "idInHeadings": true
    }
}
```

## myJsDoc 模板配置项

```javascript
{
    "templates": {
      "default": { // 可自定义指定添加到styles的目录
        "staticFiles": {
            "include": [
                 "./static"
            ]
        }
      },
      "css": [
        "styles/style.css" // 自定义样式
      ],
      "name": "Doc Template", // 文档名称
      "tabNames":{ // 导航名称
          "tutorials":"wiki",
          "apiName":"api"
      }
  }
}
```

### 如何自定义样式

首先确保项目正常跑起来

```bash
git clone https://github.com/leer0911/myJsdoc.git
cd myJsDoc
npm i
npm run serve
```

这里，`serve` 任务主要做了三件事

* 监听 scss 文件，编译成 css 对应存入 static 目录下
* 监听 jsdoc 相关文件
* 触发 gulp-jsdoc 生成文档

模板所有相关资源都在 `static` 目录下

* tmpl 目录 `layout.tmpl` 修改布局
* `publish.js` 修改由 jsdoc 传入的数据，包括 nav 信息，注释信息等
* scss 目录修改样式

运行 demo 后找到以上主要文件进行实时自定义修改

### 参考

[代码样式](https://jmblog.github.io/color-themes-for-google-code-prettify/)

[jsdoc 常用标签](http://yuri4ever.github.io/jsdoc/doc/index.html)

[tui jsdoc](https://github.com/nhnent/tui.jsdoc-template)
