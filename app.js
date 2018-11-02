const koa = require('koa');
const router = require('koa-router')();
const views = require('koa-views');
const common = require('./module/common.js');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const render = require('koa-art-template');
const path = require('path');

const app = new koa();

render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

app.use(bodyParser());


router.get('/', async (ctx, next) => {
    ctx.cookies.set('userinfo', 'zhangsan', {
        maxAge: 60 * 1000 * 60
    })

    let list = {
        name: 'zhangsan'
    }
    await ctx.render('index', { list });
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