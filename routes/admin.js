const router = require('koa-router')();

const login = require('./admin/login.js');
const user = require('./admin/user.js');

const url = require('url');

router.use(async (ctx, next) => {
    //模板引擎配置全局变量
    ctx.state.__HOST__ = "http://" + ctx.request.header.host;

    //全局信息
    ctx.state.G = {
        userinfo: ctx.session.userinfo
    };

    let pathname = url.parse(ctx.request.url).pathname;
    // 判断是否登录
    if (ctx.session.userinfo) {
        await next();
    } else {
        // 没有登录跳转登录页面
        if (
            pathname === "/admin/login"
            || pathname === "/admin/login/doLogin"
            || pathname === "/admin/login/code"
        ) {
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