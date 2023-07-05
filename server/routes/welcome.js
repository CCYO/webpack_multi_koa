
const router = require('koa-router')()
// const { render } = require('../common/utils')

router.get('/welcome', async (ctx, next) => {
	// try {
		await ctx.render('welcome', { title: '欢迎页66' })
	// } catch (e) {
	// 	next(e)
	// }
})

module.exports = router
