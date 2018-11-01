const koa = require('koa');
const router = require('koa-router')();
const views = require('koa-views');

const app = new koa();

app.use(views('views', { map: { html: 'ejs' } }));


app.use(async (ctx, next) => {
    ctx.state.userinfo = "张三";
    next();
});

app.use(async (ctx, next) => {
    ctx.body = "首页";
    console.log(new Date());
    next();
});

router.get('/', function (ctx, next) {
    ctx.body = "Hello koa";
});

router.get('/news', async (ctx, next) => {
    // ctx.body = "新闻页面";

    let arr = ['111', '222', '333'];
    let content = '<h2>这是H2</h2>'

    await ctx.render('news', { list: arr, content, })
});


router.get('/add', async (ctx) => {
    let title = "hello koa2";
    await ctx.render('index', { title });
});

app.use(router.routes());
app.use(router.allowedMethods());


app.listen(3000, () => {
    console.log("Start at port 3000");
});