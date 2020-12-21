const merge = require("webpack-merge");
const baseConfig = require("./webpack.config");
const webpack = require("webpack");
const HTMLWabpckPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const resolve = path.resolve;
module.exports = merge(baseConfig, {
    mode: "development",
    devServer: {
        port: 3002,
        // progress: true,
        contentBase: path.join(__dirname, '/src/'),
        compress: true,
        hot: true
    },
    plugins: [
        new HTMLWabpckPlugin({
            template: resolve(__dirname, 'index.html'),
            chunks: ['index'],
            filename: 'index.html',
            minify: false,
        }),
        new HTMLWabpckPlugin({
            template: resolve(__dirname, 'agent.html'),
            chunks: ['agent'],
            filename: 'agent.html',
            minify: false,
        }),
        new HTMLWabpckPlugin({
            template: resolve(__dirname, 'ddsz.html'),
            filename: 'ddsz.html',
            minify: false,
            chunks: ['ddsz']
        }),
        new MiniCssExtractPlugin({
            filename: './css/index.css'
        }),

        // 打印更新的模块路径
        new webpack.NamedModulesPlugin(),
        // 热更新
        new webpack.HotModuleReplacementPlugin(),
        
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify("development")
        })
    ]
})