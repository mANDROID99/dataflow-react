/* eslint-disable */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = (process.env.NODE_ENV || 'development') === 'development';

module.exports = {
    devtool: 'eval-source-map',
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.module\.s?css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: isDevelopment ? '[path][name]__[local]' : '[hash:base64]'
                            },
                            sourceMap: isDevelopment ? true : false
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.s?css$/,
                exclude: /\.module.s?css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment ? true : false
                        }
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss'],
        alias: {
            graph: path.resolve(__dirname, 'src/graph')
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Dataflow',
            template: './src/index.html'
        })
    ]
};
