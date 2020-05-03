const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseConfig= {
    node: {
        __dirname: false,
        __filename: false,
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
            },
            {
                test: /\.(css)$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                ],
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
                options: {
                    publicPath: './'
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: 'file-loader'
            },
            {
                test: /\.ya?ml$/,
                type: 'json',
                use: 'yaml-loader'
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    performance: {
        hints: false
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'C21 Laboratory Recipes',
            template: 'src/index.html',
        }),
    ]
}

module.exports = baseConfig
