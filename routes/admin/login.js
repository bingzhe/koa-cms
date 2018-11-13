const router = require('koa-router')();

router.get('/', async (ctx) => {
    // ctx.body = "登录";
    console.log(ctx.request.headers.host);
    await ctx.render("admin/login");
});

module.exports = router.routes();