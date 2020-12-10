const merge = require("webpack-merge");
const baseConfig = require("./webpack.config");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const OptimizeCssAssets = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
module.exports = merge(baseConfig, {
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
            }),
            new OptimizeCssAssets()
        ],
        // splitChunks: {
        //     chunks: 'all',
        //     minChunks: 1,
        //     cacheGroups: {
        //         vendors: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: 'vendors',
        //             chunks: 'initial',
        //             priority: 10,
        //             minChunks: 1,
        //         },
        //     }
        // }
    },
    mode: "production",
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify("production")
        }),
    ]
})