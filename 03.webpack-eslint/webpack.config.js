const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: "js/build.js",
        path: resolve(__dirname, "build")
    },
    module: {
        rules: [
            // js 兼容性处理： babel-loader @babel/preset-env @babel/core core-js
            //1. 基本js 兼容性处理 --》 @babel/preset-env，问题高级语法不能转换
            //2. 全部js兼容性处理 --》 @babel/polyfill（不要写webpack.config.js配置，秩序再用的js文件引入） 问题是将兼容性代码全部引入，体积太大
            //3. 应该按需加载 --》 core-js，但用了core-js既不能用第二种
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    // 预设：指示babel做怎么样的兼容性处理
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                // 按需加载
                                useBuiltIns: 'usage',
                                corejs: {
                                    version: 3,
                                    // 指定兼容性做到哪一个浏览器
                                },
                                targets: {
                                    chrome: '60',
                                    firefox: '60',
                                    ie: '9',
                                    safari: '10',
                                    edge: '17'
                                }
                            }
                        ]

                    ]
                }
            },
            /*
            * 语法检查 eslint-loader 依赖eslint
            * 注意，只检查自己写的源代码，第三方的库是不要检查 的，不写exclude 就会检查node_module
            * 设置检查规则： package.json里的eslintConfig中设置
            * airbnb --》 eslint-config-airbnb-base -- > eslint -->  eslint-plugin-import

            * package.json中继承airbnb-base
            * "eslintConfig": {
                "extends": "airbnb-base"
              }
            * */

            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    //若不加这句要手动改，加了就自动改成规范代码
                    fix: true
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: {
                // html 折行
                collapseWhitespace: true,
                // 删除注释
                removeComments: true
            }
        })
    ],
    mode: 'production'
}
