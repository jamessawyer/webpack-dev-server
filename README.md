## 部分依赖包说明

> **`rimraf`**

这个用于用来删除模块或者文件的，相当于 **`rm -rf`** 命令

比如在npm script中运行某个脚本之前，先将某个文件夹删除

```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "npm run dev",
    "dev": "webpack-dev-server --config webpack.dev.js --hot --inline --progress",
    "build": "rimraf dist && webpack -p --colors --profile --display-error-details --display-modules --progress",
    "dll": "rimraf dll && webpack --config webpack.config.dll.js -p"
  },
```

> **`CopyWebpackPlugin`**

拷贝资源
```
new CopyWebpackPlugin(
    [{
        from: './src/public/plugins',
        to: 'plugins'
    }]
)
```