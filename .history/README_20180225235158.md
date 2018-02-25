# JSDoc Template

JsDoc 文档模板

## 配置项

```json
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

- tmpl 目录 `layout.tmpl ` 修改布局
- `publish.js` 修改由 jsdoc 传入的数据，包括nav信息，注释信息等
- scss目录修改样式

用户可自行运行 demo 后找到以上主要文件进行自定义修改

### 如何运行demo

```bash
npm i
npm run serve
```
`serve` 任务 `gulp` 主要做了三件事

- 监听scss文件，编译成css对应存入static目录下
- 监听jsdoc相关文件
- 触发 gulp-jsdoc 生成文档

### 参考

[代码样式](https://jmblog.github.io/color-themes-for-google-code-prettify/)

[jsdoc常用标签](http://yuri4ever.github.io/jsdoc/doc/index.html)

[tui jsdoc](https://github.com/nhnent/tui.jsdoc-template)
