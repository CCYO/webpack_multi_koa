const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')
module.exports = {
    mode: 'development',
    entry: './tt.js',
    output: {
        path: resolve(__dirname, `tt_dist/`),
        publicPath: "/public/",
        filename: `srcipts/boundle.js`,
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: ['babel-loader'],
                exclude: /(node_modules|lib|libs)/
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                // use: [
                //     {
                //         loader: 'url-loader',
                //         options: {
                //             name: 'boundle.[hash:5].[ext]',
                //             limit: 1000,
                //             outputPath: 'imgs'
                //         },
                //     },
                // ]
                type: 'asset',
                generator: {
                    filename: 'imgs/boundle.[hash:5].[ext]'
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 50 * 1024
                    }
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        // options: {
                        // 	sources: {
                        // 		list: [
                        // 			{ tag: "img", attribute: "src", type: "src"},
                        // 			{ tag: "img", attribute: "data-src", type: "srcset"},
                        // 			{ attribute: 'data-background', type: "srcset"}
                        // 		]
                        // 	},
                        // }
                    }
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './tt.html',
            filename: '[name].[fullhash:5].html'
        })
    ]
}