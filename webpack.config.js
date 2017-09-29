const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// const CleanPlugin = require('clean-webpack-plugin');
const config = require('./config');
// const manifest = require('./dll/vendors-manifest.json');

const ROOT_PATH = path.resolve(__dirname);
const ENTRY_PATH = path.resolve(ROOT_PATH, 'src');
const OUTPUT_PATH = path.resolve(ROOT_PATH, 'dist');


module.exports = {
    entry: {
        index: path.resolve(ENTRY_PATH, 'index.js'),

    },
    output: {
        path: OUTPUT_PATH,
        publicPath: '/',
        filename: '[name]-[chunkhash].js',
    },
    // devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /favicon.(png|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]?[hash]',
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[name]-[local]-[hash:base64:5]',
                                importLoaders: 1,
                            },
                        },
                        'postcss-loader',
                    ],
                }),
            },
            /* {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'postcss-loader'
                    ]
                })
            }, */
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?modules', 'sass-loader', 'postcss-loader'],
                }),
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                exclude: /favicon.png$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                ],
            }
            /* {
                test: /\.(png|jpg|gif|bmp|jpeg|JPG|GIF|PNG|BMP|JPEG)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.(eot|woff|ttf|woff2|svg)$/,
                use: 'url-loader'
            } */
        ]
    },
    plugins: [
        // new CleanPlugin(['public']),
        // new ProgressBarPlugin(),
        // new ExtractTextPlugin('index.css'), //单独打包css
        new webpack.optimize.AggressiveMergingPlugin(), // 改善chunk传输
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new CopyWebpackPlugin([
            // {
            //   from: './dll/vendors.dll.js',
            //   to: 'dll.js',
            // },
            {
                from: './public/**/*',
                to: '[name].[ext]',
            },
        ], {
            ignore: ['index.html', 'index.dev.html'],
            copyUnmodified: true,
            debug: 'debug',
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            hash: true,
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
            },
        }),
        new webpack.NoEmitOnErrorsPlugin(), // 保证出错时页面不阻塞，且会在编译结束后报错
        new ExtractTextPlugin({ // 单独打包css
            filename: 'bundle.[contenthash].css',
            disable: false,
            allChunks: true,
        }),
        new webpack.HashedModuleIdsPlugin(), // 用 HashedModuleIdsPlugin 可以轻松地实现 chunkhash 的稳定化
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false, // 最紧凑的输出
            comments: false, // 删除所有的注释
            compress: {
                warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
                // support_ie8: false, // 还可以兼容ie浏览器
                drop_console: true, // 删除所有的 `console` 语句
                collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
            },
        }),
        new OpenBrowserPlugin({
            url: `http://${config.host}:${config.port}`,
        }),
    ],
    resolve: {
        extensions: ['.js', '.json', '.sass', '.scss', '.jsx'],
    },
};
