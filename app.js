const koa = require('koa');
const router = require('koa-router')();
const views = require('koa-views');
const common = require('./module/common.js');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const render = require('koa-art-template');
const path = require('path');
const session = require('koa-session');
const DB = require("./module/db.js");

const app = new koa();

render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

app.use(bodyParser());


app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess', //cookie key (default is koa:sess)
    maxAge: 86400000, // cookie 的过期时间 maxAge in ms (default is 1 days) //需要设置
    overwrite: true, //是否可以 overwrite (默认 default true)
    httpOnly: true, //cookie 是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true, //签名默认 true
    rolling: false, //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
    renew: false, //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));


router.get('/', async (ctx, next) => {
    ctx.cookies.set('userinfo', 'zhangsan', {
        maxAge: 60 * 1000 * 60
    })

    let list = {
        name: 'zhangsan'
    }

    console.log(ctx.session.userinfo);
    await ctx.render('index', { list });
});

router.get('/login', async (ctx, next) => {
    // ctx.session.userinfo = "张三";
    // ctx.body = "登录成功";
    let result = await DB.find('user', {});
    ctx.body = result;

});

router.get('/news', async (ctx) => {
    var userinfo = ctx.cookies.get('userinfo');
    console.log(userinfo);

    let list = {
        name: 'zhangsan'
    }
    await ctx.render('news', {
        list
    });
});


app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
    console.log("Start at port 3000");
});

