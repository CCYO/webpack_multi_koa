// const express = require('express')
// const router = express.Router()
const router = require('koa-router')()
const { render } = require('../common/utils')

router.get('/home', async (ctx, next) => {
	await ctx.render('home', { title: '首页' })
	// try {
		// await render(ctx, 'home', { title: '首页' })
		// ctx.body = '666687'
		// await next()
		// return
	// } catch (e) {
	// 	next(e)
	// }
})
/*
router.get('/home', async (req, res, next) => {
	try {
		await render(res, 'home', { title: '首页' })
	} catch (e) {
		next(e)
	}
})
*/
module.exports = router
