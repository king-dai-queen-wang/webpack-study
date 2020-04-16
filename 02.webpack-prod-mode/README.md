* 用MiniCssExtractPlugin.loader将css单独提取
```
packagejosn: {
    "browserslist": {
        // 开发模式兼容最新1版的chrome，firefox，safari
        // 开发环境 --》 设置node环境变量： process.env.NODE_ENV = 'development'
        "development": [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version"
        ],
        "production": [
    //     生产模式，兼容99.8%的浏览器，不要已经死了的浏览器，不要op_mini 浏览器
          ">0.2%",
          "no dead",
          "not op_mini all"
        ]
      }
}
```
