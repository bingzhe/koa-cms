const router = require('koa-router')();

const login = require('./admin/login.js');
const user = require('./admin/user.js');


router.use(async (ctx, next) => {
    //模板引擎配置全局变量
    ctx.state.__HOST__ = "http://" + ctx.request.header.host;

    // 判断是否登录
    if (ctx.session.userinfo) {
        await next();
    } else {
        // 没有登录跳转登录页面
        if (ctx.url === "/admin/login" || ctx.url === "/admin/login/doLogin") {
            await next();
        } else {
            ctx.redirect('/admin/login');
        }
    }

});

router.get('/', async (ctx) => {
    await ctx.render('admin/index');
});

router.use('/login', login);
router.use('/user', user);

module.exports = router.routes();