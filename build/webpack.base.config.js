const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const glob = require('glob')
const { resolve } = require('path')
const CONFIG = require('./config.js')
const isDev = process.env.NODE_ENV === 'development'

console.log('@c => ', CONFIG.PUBLIC_PATH)
module.exports = {
	context: resolve(__dirname),
	entry: ((filepathList) => {
		let entry = {}
		filepathList.forEach(filepath => {
			const list = filepath.split(/[\/|\/\/|\\|\\\\]/g) // eslint-disable-line
			const key = list[list.length - 1].replace(/\.js/g, '')
			// 如果是开发环境，才需要引入 hot module
			entry[key] = isDev ?
				// filepath
				[filepath, 'webpack-hot-middleware/client?reload=true']
				: filepath
		})
		return entry
	})(glob.sync(resolve(__dirname, '../src/js/*.js'))),

	output: {
		path: resolve(__dirname, `../${CONFIG.DIR.DIST}`),
		publicPath: CONFIG.PUBLIC_PATH,
		filename: `${CONFIG.DIR.SCRIPT}/[name].bundle.js`,
		chunkFilename: `${CONFIG.DIR.SCRIPT}/[name].[chunkhash].js`,
		clean: true
	},

	resolve: {
		alias: {
			'@': resolve(__dirname, '../src'),
			js: resolve(__dirname, '../src/js'),
			css: resolve(__dirname, '../src/css'),
			less: resolve(__dirname, '../src/less')
		}
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				use: ['babel-loader'],
				exclude: /(node_modules|lib|libs)/
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				type: 'asset',
				generator: {
					outputPath: CONFIG.DIR.IMAGE,
					publicPath: `${CONFIG.PUBLIC_PATH}${CONFIG.DIR.IMAGE}/`,
					filename: `[name].[hash:5].[ext]`
				},
				parser: {
					dataUrlCondition: {
						maxSize: 8 * 1024
					}
				},
				use: [
					{
						loader: 'image-webpack-loader',
						options: {
							disable: process.env.NODE_ENV !== 'production',
							pngquant: {
								quality: [0.3, 0.5]
							}
						}
					}
				]
			},
			{
				test: /\.(eot|woff2|woff|ttf|svg)$/,
				type: 'asset/resource',
				generator: {
					outputPath: CONFIG.DIR.FONT,
					publicPath: `${CONFIG.PUBLIC_PATH}${CONFIG.DIR.FONT}/`,
					filename: `[name].[hash:5].[ext]`
				},
				// use: [
				// 	{
				// 		loader: 'file-loader',
				// 		options: {
				// 			outputPath: CONFIG.DIR.FONT
				// 		}
				// 	},
				// 	{
				// 		loader: 'url-loader'
				// 	}
				// ]
			},
			{
				test: /\.ejs$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							sources: {
								list: [
									{ tag: "img", attribute: "src", type: "src" },
									{ tag: "img", attribute: "data-src", type: "srcset" },
									{ attribute: 'data-background', type: "srcset" }
								]
							}
						}
					},
					{
						loader: 'template-ejs-loader',
						options: {
							production: process.env.ENV === 'production'
						}
					}
				]
			}
		]
	},

	plugins: [
		// 打包文件
		...glob.sync(resolve(__dirname, '../src/views/*.ejs')).map((filepath, i) => {
			const tempList = filepath.split(/[\/|\/\/|\\|\\\\]/g) // eslint-disable-line
			// 读取 CONFIG.EXT 文件自定义的文件后缀名，默认生成 ejs 文件，可以定义生成 html 文件
			const filename = (name => `${name.split('.')[0]}.${CONFIG.EXT}`)(`${CONFIG.DIR.VIEW}/${tempList[tempList.length - 1]}`)
			const template = filepath
			const fileChunk = filename.split('.')[0].split(/[\/|\/\/|\\|\\\\]/g).pop() // eslint-disable-line
			const chunks = isDev ? [fileChunk] : ['manifest', 'vendors', fileChunk]
			return new HtmlWebpackPlugin({
				filename, template, chunks,
				alwaysWriteToDisk: true,
			})
		}),
		new webpack.ProvidePlugin({
			$: 'jquery'
		}),
	]
}
