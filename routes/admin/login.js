const router = require('koa-router')();
const tools = require('../../module/tools.js');
const DB = require('../../module/db.js');

router.get('/', async (ctx) => {
    await ctx.render("admin/login");
});

router.post('/doLogin', async (ctx) => {
    console.log(ctx.request.body);

    let username = ctx.request.body.username;
    let password = ctx.request.body.password;


    // 1.验证
    // 2.数据库匹配
    // 3. 成功之后用户信息写入session

    let result = await DB.find('admin', { 'username': username, 'password': tools.md5(password) });

    if (result.length > 0) {
        console.log("成功");
        console.log(result[0]);

        ctx.session.userinfo = result[0];
        ctx.redirect(ctx.state.__HOST__ + '/admin');

    } else {
        console.log("失败");
    }




});

module.exports = router.routes();