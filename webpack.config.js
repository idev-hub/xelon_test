const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCxssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const plugins = () => {
    const base = [
        new HtmlWebpackPlugin({
            template: 'views/index.pug',
            inject: true
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, './src/favicon.png'),
                    to: path.resolve(__dirname, './dist')
                },
                {
                    from: path.resolve(__dirname, './src/thumbnail.png'),
                    to: path.resolve(__dirname, './dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css'
        }),
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
        main: ['@babel/polyfill', 'webp-in-css/polyfill', './main.js']
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: '[contenthash][ext]'
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@images': path.resolve(__dirname, 'src/assets/images'),
            '@svg': path.resolve(__dirname, 'src/assets/images/svg'),
            '@templates': path.resolve(__dirname, 'src/views/templates'),
        }
    },
    optimization: optiomization(),
    devServer: {
        port: 3000,
        hot: isDev,
        static: {
            directory: path.join(__dirname, 'src'),
            watch: true,
        }
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
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.s[ac]ss/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    {loader: 'svg-sprite-loader', options: {}},
                    'svg-transform-loader',
                    'svgo-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|webp|gif)/,
                type: 'asset/resource'
            },
            {
                test: /\.(ttf|woff|woff2|eot)/,
                type: 'asset/resource'
            },
            {
                test: /\.pug$/,
                use: ['pug-loader']
            },
        ]
    }
}