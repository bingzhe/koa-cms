const router = require('koa-router')();

const url = require('url');

router.use(async (ctx, next) => {
    //模板引擎配置全局变量
    ctx.state.__HOST__ = "http://" + ctx.request.header.host;

    let pathname = url.parse(ctx.request.url).pathname.substring(1);
    let splitUrl = pathname.split('/');

    //全局信息
    ctx.state.G = {
        url: splitUrl,
        userinfo: ctx.session.userinfo,
        prevPage: ctx.request.headers['referer']
    };

    // 判断是否登录
    if (ctx.session.userinfo) {
        await next();
    } else {
        // 没有登录跳转登录页面
        if (
            pathname === "admin/login"
            || pathname === "admin/login/doLogin"
            || pathname === "admin/login/code"
        ) {
            await next();
        } else {
            ctx.redirect('/admin/login');
        }
    }

});


const index = require('./admin/index.js');
const login = require('./admin/login.js');
const user = require('./admin/user.js');
const manage = require('./admin/manage.js');
const articlecate = require('./admin/articlecate.js');
const article = require('./admin/article.js');

//后台首页
router.use(index);

router.use('/login', login);
router.use('/user', user);
router.use('/manage', manage);
router.use('/articlecate', articlecate);
router.use('/article', article);

module.exports = router.routes();