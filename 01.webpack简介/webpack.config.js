/*
* webpack.config.js webpack的配置文件
*   作用： 指示webpack干哪些活，（当运行webpack命令的时候，会加载里面的配置）
*   所有构建工具都是基于nodejs平台运行的，模块化默认采用common.js
*
* loader: 1.下载，2.使用（配置loader）【！！！！】
* plugins： 1.下载 2.引入 3.使用【！！！】
* */
//common.js 的写法/nodejs里写法
// resolve 是用来拼接绝对路径的方法
const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
//    webpack配置
//     入口文件
    entry: './src/index.js',
//     输出
    output: {
    //    输出的文件名
        filename: 'build.js',
    //    输出路径,__dirname是nodejs变量，代表当前文件的目录觉得路径。即 C:\project\webpack-study\01.webpack简介，+ build
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
        //    详细loader配置
            {
            //    正则匹配哪些文件
            //     匹配以css结尾的文件
                test: /\.css$/,
                use: [
                    // 【!!!!】use 数组中的loader执行顺序：从右到左，or从下到上
                    // 创建style标签，将js中的样式资源插入进行添加到header中生效
                    'style-loader',
                    // 将css文件变成common。js 模块加载到js中，其内容是样式字符串【先执行!!!】
                    'css-loader'
                ]
            },
            // 配置.scss结尾的文件类型用sass-loader来解析
            {
                test: /\.scss$/,
                use: [
                    // 3.最后将css文件加载到header的style里去
                    'style-loader',
                    // 2.再用css-loader 加载css
                    'css-loader',
                    // 1.先用scss-loader处理成为css
                    'sass-loader'
                ]
            },
            // 以下这种有问题，不能处理html里面引入的图片
            {
                test: /\.(jpg|pang|gif|jfif)$/,
                loader: 'url-loader',
                // 配置的参数
                options: {
                    // 将图片大小小于8kb，就会被base64处理
                    // 优点： 减少请求数量，减少服务器压力
                    //缺点，size会变大（文件访问请求慢点）
                    // 8kb以下的话用base64处理
                    limit: 8 * 1024,
                //     问题，因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs，解析会出问题，
                    //     html里的img src=[object Module]
                    //     解决： 关闭url-loader的es6模块化解析
                    esModule: false,
                //    如果觉得图片的hash名字太长，取hash值的前10位
                //    [ext]取原来的文件名做为扩展名
                    name: '[hash:10].[ext]'
                }
            }, {
                test: /\.html$/,
                // z专门处理html引入的的img图片，从而被url-loader进行处理
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
    //    详细的plugins配置
        // 功能： 默认会创建一个空的html文件，引入打包输出的所有资源
        // 需求： 需要有结构的HTML文件
        new HtmlWebpackPlugin({
            //     复制'./src/index.html'文件，并且自动引入所需资源（js/css）
            template: './src/index.html'
        }),
    ],
    mode: 'development', // 开发模式
//    mode: 'production, // 生产模式
};
