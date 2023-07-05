const { resolve } = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
// const OptimizeCss = require('optimize-css-assets-webpack-plugin')
const OptimizeCss = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin');
const CONFIG = require('./config')
const glob = require('glob')
const webpackBaseConfig = require('./webpack.base.config')

module.exports = merge(webpackBaseConfig, {
	module: {
		rules: [
			{
				test: /\.less|\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 2
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									["postcss-preset-env"]
								]
								// options: {
								// 	ident: 'postcss',
								// 	plugins: [
								// 		require('postcss-cssnext')()
								// 	]
							}
						}
					},
					// 可能有朋友会有搭建响应式的需求，这块需要用到 postcss-px2rem 或者 px2rem-loader 之类的插件
					// 由于这类插件需要指定 remUnit 即设计图文件尺寸，我们可能需要分别打包 750px 和 1920px 的版本
					// 如何让 px2rem-loader 分别识别两种版本并进行分离打包呢？
					// 这边可以用到 loader 的另一种函数写法，其中 options.realResource 就是当前被处理文件的绝对路径
					// 这边可以用样式文件夹来区分，如果是 /pc/ 文件夹下的样式文件，就使用 1920px 版本，否则使用 750px
					/*
					({ realResource }) => {
						return /\\pc\\/i.test(realResource) ? 'px2rem-loader?remUnit=192' : 'px2rem-loader?remUnit=75'
					},
					*/
					'less-loader'
				]
			}
		]
	},

	plugins: [
		// new CopyWebpackPlugin({
		// 	patterns: [
		// 		{
		// 			from: resolve(__dirname, '../src/css/lib'),
		// 			to: resolve(__dirname, `../${CONFIG.DIR.DIST}/${CONFIG.DIR.STYLE}`)
		// 		}
		// 	]
		// }),
		new FileManagerPlugin({
			// destination 相對 webpack context
			events: {
				onEnd: [
					{
						copy: [
							// { source: `../${CONFIG.DIR.DIST}/${CONFIG.DIR.VIEW}`, destination: '../server/views' },
							{ 
								source: `../${CONFIG.DIR.DIST}/[!views]`,
								destination: '../server/assets',
								// options: {
								// 	globOptions: {
								// 		dot: true,
								// 		ignore: ['views/*']
								// 	}
								// }
							},
						]
					},
					// {
					// 	delete: [`../${CONFIG.DIR.DIST}/${CONFIG.DIR.VIEW}`]
					// },
					// {
					// 	move: [
					// 		{ source: `../${CONFIG.DIR.DIST}`, destination: '../server/assets' },
					// 	]
					// }
				]
			}
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),

		new MiniCssExtractPlugin({
			filename: `${CONFIG.DIR.STYLE}/[name].[hash:5].min.css`
		}),

		new OptimizeCss()
	],

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					minChunks: 1,
					chunks: 'all',
					priority: 100
				}
			}
		},
		runtimeChunk: {
			name: 'manifest'
		}
	},

	devtool: 'cheap-module-source-map',

	mode: 'production'
})
