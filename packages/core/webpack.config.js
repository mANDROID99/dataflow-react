/* eslint-disable */

const path = require('path');
const PnpWebpackPlugin = require(`pnp-webpack-plugin`);
var nodeExternals = require('webpack-node-externals');

module.exports = {
    devtool: 'source-map',
    entry: './src/index.ts',
    externals: [
        nodeExternals({
            modulesFromFile: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.s?css$/,
                exclude: /\.module.s?css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        plugins: [
            PnpWebpackPlugin
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'ngraph-editor',
        libraryTarget: 'umd'
    },
    resolveLoader: {
        plugins: [
            PnpWebpackPlugin.moduleLoader(module)
        ]
    }
};
