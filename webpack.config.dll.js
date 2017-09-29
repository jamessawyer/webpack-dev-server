const webpack = require('webpack')
const path = require('path');
const library = '[name]_lib';

module.exports = {
    entry: {
        vendors: [
            'react',
            'react-dom',
            'redux',
            'react-redux'
        ]
    },
    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, 'dll'),
        library
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new webpack.DllPlugin({
            path: path.join(__dirname, 'dll/[name]-manifest.json'),
            context: __dirname,
            name: library
        }),
        // new webpack.optimize.ModuleConcatenationPlugin(), // 模块串联，大幅减少包大小257k =》239k
        new webpack.optimize.UglifyJsPlugin({
            uglifyOptions: {
                warning: false,
                // compress: {
                    
                // },
                mangle: {
                    except: ['exports', 'require']
                }
            }
        })

    ]
}
