const webpack = require('webpack');
const path = require('path')
const baseConfig = require('./webpack.base.config')

const env = 'development'

const baseDevConfig= {
    ...baseConfig,
    mode: env,
    watch: true,
    plugins: [
        ...baseConfig.plugins,
        new webpack.DefinePlugin({
            'process.env': {
                mode: JSON.stringify(env),
            }
        })
    ]
}

module.exports = [
    {
        ...baseDevConfig,
        entry: {
            bundle: path.join(__dirname, 'src/index.tsx'),
        },
        output: {
            path: path.join(__dirname, 'assets/'),
            filename: '[name].js'
        },
        plugins: [
            ...baseDevConfig.plugins,
        ],
        devServer: {
            host: "localhost",
            contentBase: path.join(__dirname, "assets"),
            watchContentBase: true,
            historyApiFallback: true,
            open: false,
        }
    }
]
