const router = require('koa-router')();

router.get('/', async (ctx) => {
    // await ctx.render('index');
    await ctx.render('admin/user/list');
    // ctx.body = "用户管理";
});

router.get('/add', async (ctx) => {
    await ctx.render('admin/user/add');    
    // ctx.body = "增加用户";
});

router.get('/edit', async (ctx) => {
    ctx.body = "编辑用户";
});

router.get('/delete', async (ctx) => {
    ctx.body = "删除用户";
});

module.exports = router.routes();