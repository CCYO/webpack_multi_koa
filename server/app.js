const path = require('path')

const webpack = require('webpack')
const koaMount = require('koa-mount')
const koaStatic = require('koa-static')
const koaConvert = require('koa-convert')
const webpackDevMiddleware = require('./middleware/_webpackDev')

const webpackHotMiddleware = require('koa-webpack-hot-middleware')
const Koa = require('koa')
const views = require('@ladjs/koa-views');

const CONFIG = require('../build/config')
const isDev = process.env.NODE_ENV === 'development'

const homeRouter = require('./routes/home')
const welcomeRouter = require('./routes/welcome')
const app = new Koa()

let webpackConfig = require('../build/webpack.dev.config')
let compiler = webpack(webpackConfig)


if (isDev) {
	// 用 webpack-dev-middleware 启动 webpack 编译
	app.use(
		webpackDevMiddleware(compiler, {
			publicPath: webpackConfig.output.publicPath,
			stats: {
				colors: true
			}
		})
	)
	// 使用 webpack-hot-middleware 支持热更新
	app.use(
		koaConvert(
			webpackHotMiddleware(compiler, {
				publicPath: webpackConfig.output.publicPath,
				noInfo: true,
				reload: true
			})
		)
	)
	// 指定开发环境下的静态资源目录
	app.use(koaMount(
		CONFIG.PATH.PUBLIC_PATH,
		koaStatic(path.join(__dirname, '../src'))
	))
} else {
	app.use(koaMount(CONFIG.PATH.PUBLIC_PATH, koaStatic(path.join(__dirname, `./${CONFIG.DIR.ASSET}`))))
	const viewRoot = path.resolve(__dirname, '../dist/views')
	app.use(views(viewRoot, { extension: 'ejs', map: { ejs: 'ejs' }, viewExt: 'ejs' }))
}
const viewRoot = path.resolve(__dirname, '../dist/views')
app.use(views(viewRoot, { extension: 'ejs', map: { ejs: 'ejs' }, viewExt: 'ejs' }))
app.use(homeRouter.routes(), homeRouter.allowedMethods())
app.use(welcomeRouter.routes(), welcomeRouter.allowedMethods())

app.on('error', (error, ctx) => {
	console.log(`@ 發生未預期的錯誤!!!! =>`, error)
});
module.exports = app
