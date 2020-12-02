const merge = require("webpack-merge");
const baseConfig = require("./webpack.config");
const webpack = require("webpack");
const path = require("path");
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
        // 打印更新的模块路径
        new webpack.NamedModulesPlugin(),
        // 热更新
        new webpack.HotModuleReplacementPlugin(),
        
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify("development")
        })
    ]
})