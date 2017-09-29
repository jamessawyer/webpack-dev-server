const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// const CleanPlugin = require('clean-webpack-plugin');
const config = require('./config');
const manifest = require('./dll/vendors-manifest.json');

const ROOT_PATH = path.resolve(__dirname);
const ENTRY_PATH = path.resolve(ROOT_PATH, 'src');
const OUTPUT_PATH = path.resolve(ROOT_PATH, 'dist');

console.log(path.resolve(ENTRY_PATH, 'index.js'))

module.exports = {
    entry: {
        // index: [
        //     'react-hot-loader/patch',
        //     `webpack-hot-middleware/client?path=http://${config.host}:${config.port}/__webpack_hmr`,
        //     'babel-polyfill',
        //     path.resolve(ENTRY_PATH, 'index.js')
        // ],
        index: [
            'react-hot-loader/patch', // 开启react热更新
            `webpack-dev-server/client?http://${config.host}:${config.port}`, // 打包并且连接到提供的端点
            'webpack/hot/only-dev-server', // 打包客户端热加载 only- 表示只有成功更新后才热加载
            path.resolve(ENTRY_PATH, 'index.js'), // 应用的入口点
        ],
    },
    output: {
        path: OUTPUT_PATH,
        publicPath: '/',
        filename: '[name].js',
    },
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                // use: ['babel-loader']
                use: ['react-hot-loader/webpack', 'babel-loader'],
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
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]', 'less-loader', 'postcss-loader'],
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader?modules', 'sass-loader', 'postcss-loader'],
            },
            /*  {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    'style-loader', 
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localdentName: '[name]-[local]-[hash:base64:5]',
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    'style-loader', 
                    {
                        loader: 'css-loader',
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.s[a|c]ss$/,
                use: [
                    { loader: 'style-loader' }, 
                    { loader: 'css-loader', options: {
                        sourceMap: true
                    }}, 
                    { loader: 'sass-loader', options: {
                        sourceMap: true
                    }}
                ],
            }, */
            // {
            //     test: /\.s[a|c]ss$/,
            //     use: ['style-loader', 'css-loader?modules', 'sass-loader', 'postcss-loader'],
            // },
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
            },
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
            }, */
            /*  {
                test: /\.(eot|woff|ttf|woff2|svg)$/,
                use: 'url-loader'
            } */
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new CopyWebpackPlugin([{ from: './dll/vendors.dll.js', to: 'dll.js' }]),
        // new CleanPlugin(['public']),
        new ProgressBarPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(), // 改善chunk传输
        // new webpack.HotModuleReplacementPlugin(), // enable HMR globally
        new HtmlWebpackPlugin({ template: './public/index.dev.html' }),
        // new HtmlWebpackPlugin({
        //     title: 'REDUX APP',
        //     showErrors: true
        // }),
        new webpack.NoEmitOnErrorsPlugin(), // 保证出错时页面不阻塞，且会在编译结束后报错
        new webpack.NamedChunksPlugin(), // prints more readable module name
        new webpack.DllReferencePlugin({ context: __dirname, manifest }),
        /* new webpack.HashedModuleIdsPlugin({ //用 HashedModuleIdsPlugin 可以轻松地实现 chunkhash 的稳定化
            name: 'vendor',
            minChunks: function(module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }), */
        new OpenBrowserPlugin({ // 自动打开浏览器
            url: `http://${config.host}:${config.port}`,
        }),
    ],
    resolve: {
        extensions: ['.js', '.json', '.sass', '.scss', '.jsx'],
    },
    devServer: {
        port: 8000,
        host: '0.0.0.0',
        historyApiFallback: true,
        hot: true,
        disableHostCheck: true,
        contentBase: '/', // 配置服务器目录
        publicPath: '/', // 同output的publicPath
    },
};
