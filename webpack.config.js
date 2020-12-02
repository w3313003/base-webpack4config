/**
 * loader类型
 * 前置loader 正常loader 后置loader 内联loader
 * loader默认从右到左 从下到上执行
 */
const webpack = require("webpack");
const HTMLWabpckPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const Happypack = require("happypack");
const resolve = path.resolve;
const devMode = process.argv[process.argv.length - 1] !== 'production';
const Progress = require("progress-bar-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "js/bundlea.[hash].js",
        path: path.resolve(__dirname, 'dist'),
        // publicPath: "/"
    },
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules')],
        extensions: ['.js','.css'],
        // mainFields: ["style", 'main'],
    },
    module: {
        // noParse: /jquery/,
        rules: [
            // 手动引入jquery时触发 将 $!jquery
            // {
            //     test: require.resolve("jquery"),
            //     use: "expose-loader?$"
            // },
            
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|dist)/,
                include: resolve(__dirname, 'src'),
                enforce: 'pre',
                use: [
                    {
                        loader: "eslint-loader",
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: resolve(__dirname, 'src'),
                use: "Happypack/loader?id=js"
            },
            {
                test: /\.css$/,
                use: [
                    devMode ? {
                        loader: 'style-loader',
                        options: {
                            insertAt: "top"
                        }
                    } : {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../"
                        }
                    },
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.styl$/,
                use: [
                    devMode ? {
                        loader: 'style-loader',
                        options: {
                            insertAt: "top"
                        }
                    } : {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../"
                        }
                    },
                    'css-loader',
                    'postcss-loader',
                    'stylus-loader',
                ]
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        // publicPath: "./",
                        name: 'img/[hash:7].[ext]',
                    },
                    
                },
            }
        ]
    },
    resolveLoader: {
        modules: [path.resolve(__dirname, './src/loaders'), 'node_modules']
    },
    plugins: [
        new HTMLWabpckPlugin({
            template: resolve(__dirname, 'index.html'),
            filename: 'index.html',
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
            },
            hash: true
        }),
        new CopyWebpackPlugin([{
            from: resolve(__dirname, 'static'),
            to: resolve(__dirname, 'dist/static'),
            ignore: ['.*']
        }]),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:6].css'
        }),
        // 向每个模块中注入jquery
        new webpack.ProvidePlugin({
            "$": "jquery"
        }),
        // 忽略第三方库中的命中依赖 如moment中的语言包 如果使用需手动引入
        new webpack.IgnorePlugin(/\.\/locale/, /moment/),
        // Dll引用目标
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: resolve(__dirname, 'static', 'manifest.json')
        // }),
        // 多线程打包
        new Happypack({
            id: "js",
            use: [
                {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins: [
                            // 类属性装饰器
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            // 编译class语法
                            ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                            // 添加高级API支持
                            '@babel/plugin-transform-runtime',
                            // 动态import
                            '@babel/plugin-syntax-dynamic-import'
                        ]
                    }
                }
            ]
        }),
        new Progress()
    ],
    // 表示该模块不需打包，支持对象 字符串等写法
    externals: /lodash|jquery/i
}
