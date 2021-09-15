const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCxssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const fs = require('fs')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const plugins = () => {
    const base = [
        new HtmlWebpackPlugin({
            template: '!!ejs-webpack-loader!src/views/index.ejs',
            inject: "head"
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, './src/favicon.png'),
                    to: path.resolve(__dirname, './dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css'
        })
    ]

    if (isProd) {
        base.push(new BundleAnalyzerPlugin())
    }

    return base
}
const optiomization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new OptimizeCxssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}
const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: {
            presets: [
                '@babel/preset-env'
            ]
        }
    }]

    if (isDev) {
        loaders.push('eslint-loader')
    }

    return loaders
}

module.exports = {
    mode: 'development',
    devtool: isDev ? 'source-map' : false,
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: ['@babel/polyfill', './main.js']
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@images': path.resolve(__dirname, 'src/assets/images'),
            '@templates': path.resolve(__dirname, 'src/templates'),
        }
    },
    optimization: optiomization(),
    devServer: {
        port: 3000,
        hot: isDev
    },
    plugins: plugins(),
    module: {
        rules: [

            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.css/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.s[ac]ss/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|jpeg|svg|webp|gif)/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)/,
                use: ['file-loader']
            }
        ]
    }
}