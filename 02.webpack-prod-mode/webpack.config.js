const { resolve } = require('path');

// 自动让html引入依赖资源文件的插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 将css与html分离的插件
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');

// css兼容性的插件，此插件依赖 postcss-loader
const PostcssPresetEnv = require('postcss-preset-env');

const commonCssLoader = [
    // 创建style标签将样式放进去，若不想加style标签整合样式，想要将css分离，则注释下面
    // 'style-loader',
    // 用 MiniCssExtractPlugin.loader替代 style-loader，作用是提取js中的css成单独文件
    MiniCssExtractPlugin.loader,
    // 将css文件整合到js文件中
    'css-loader',
    //    css兼容性处理： postcss --》 postcss-loader postcss-preset-env
    //    帮postcss找到package.json中的browserlist里面的配置，通过配置加载指定的兼容css样式
    /*package.json:
    * {
        // 开发模式兼容最新1版的chrome，firefox，safari
        * 默认是生产模式，若想指定开发模式，则需下面这句
        // 开发环境 --》 设置node环境变量： process.env.NODE_ENV = 'development'
        "development": [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version"
        ],
        "production": [
        // 生产模式，兼容99.8%的浏览器，不要已经死了的浏览器，不要op_mini 浏览器
          ">0.2%",
          "no dead",
          "not op_mini all"
        ]
      }
    * */
    //    使用loader的默认配置
    //    'postcss-loader'
    //    若要修改loader的配置
    {
        loader: "postcss-loader",
        options: {
            ident: 'postcss',
            plugins: () => [
                //     postcss插件
                PostcssPresetEnv()
            ]
        }
    }
];

// 压缩css的插件
const  OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

// 设置nodejs环境变量,若不设置，则是"production"模式
// process.env.NODE_ENV = 'development';
module.exports = {
    entry: './src/js/index',
    output: {
        filename: "js/build.js",
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [...commonCssLoader]
            },
            {
                test: /\.scss$/,
                // use 可以复用 use: [[...commonCssLoader], 'sass-loader']
                use: [ // use数组是从下往上执行
                    // 4.MiniCssExtractPlugin.loader对css进行提取成单独文件
                    MiniCssExtractPlugin.loader,
                    // 3.css-loader 把处理过兼容性的css加载到js种
                    'css-loader',
                    // 2.对sass-loader 编译出来的 css 用postcss-loader进行兼容性处理
                    {
                        // 需要再package.json里指定browerlist
                        loader: "postcss-loader",
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                PostcssPresetEnv()
                            ]
                        }
                    },
                    // 1.先用sass-loader 编译成css
                    'sass-loader'
                ]
            },
            /*
            * 正常来讲，一个文件只能被一个loader处理，
            * 当一个文件要被多个loader执行，那么一定要注意顺序
            * 要先执行eslint 在执行babel
            * */
            // eslint检查(package.json 种要配置esConfig --》 aribnb)
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                // enforce: 'pre'： 所有loader都要等该loader执行完了才可以执行，不管代码写的顺序
                enforce: 'pre',
                options: {
                    fix: true
                }
            },
            // 兼容性处理
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                useBuiltIns: 'usage',
                                corejs: {version: 3},
                            }
                        ]
                    ]
                }
            },
            // 处理图片
            {
                test: /\.(jpg|png|gif|jfif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8 * 1024,
                    name: '[hash:10].[ext]',
                    outputPath: 'assets/img',
                    // esModule: false,
                }
            },
            // 处理html里的图片问题
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                exclude: /\.(js|css|scss|html|jpg|png|gif|jfif)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'media'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            // 将分离出来的css文件重命名
            filename: 'css/build.css'
        }),
        // 压缩css成1行
        new OptimizeCssAssetsWebpackPlugin(),
    ],
    mode: "development",
    //    启动devServer指令为： npx webpack-dev-server 【！！！】
    devServer: {
        // 要运行的代码目录dist里的代码
        contentBase: resolve(__dirname, 'build'),
        // 启动gzip压缩
        compress: true,
        // 端口号
        port: 3000,
        // 自动打开浏览器
        open: true
    }
};
