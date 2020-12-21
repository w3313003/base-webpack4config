const merge = require("webpack-merge");
const baseConfig = require("./webpack.config");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const OptimizeCssAssets = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HTMLWabpckPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");
const resolve = path.resolve;

module.exports = merge(baseConfig, {
    output: {
        filename: "[name]/index.js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/"
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
            }),
            new OptimizeCssAssets()
        ],
    },
    mode: "production",
    plugins: [
        new HTMLWabpckPlugin({
            template: resolve(__dirname, 'index.html'),
            chunks: ['index'],
            filename: 'index/index.html',
            minify: false,
        }),
        new HTMLWabpckPlugin({
            template: resolve(__dirname, 'agent.html'),
            chunks: ['agent'],
            filename: 'agent/index.html',
            minify: false,
        }),
        new HTMLWabpckPlugin({
            template: resolve(__dirname, 'ddsz.html'),
            filename: 'ddsz/index.html',
            minify: false,
            chunks: ['ddsz']
        }),
        new MiniCssExtractPlugin({
            filename: '[name]/index.css',
            publicPath: "/"
        }),
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify("production")
        }),
    ]
})