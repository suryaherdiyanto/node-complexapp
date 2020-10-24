const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MinimizerCssPlugin = require('optimize-css-assets-webpack-plugin');
const { DumpMetaPlugin } = require('dumpmeta-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle/[name].[hash].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    optimization: {
        minimizer: [
            new TerserPlugin(),
            new MinimizerCssPlugin()
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/bundle/[name].[hash].css'
        }),
        new DumpMetaPlugin({
            filename: 'dist/meta.json',
            prepare: (stats) => ({
                hash: stats.hash
            })
        })
    ]
});