const webpack = require('webpack');
const path = require('path')
const baseConfig = require('./webpack.base.config')

const env = 'production'

const baseDevConfig= {
    ...baseConfig,
    mode: env,
    watch: false,
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
    }
]
