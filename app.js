const koa = require('koa');
const router = require('koa-router')();
const views = require('koa-views');
const common = require('./module/common.js');
const bodyParser = require('koa-bodyparser')

const app = new koa();

app.use(views('views', { map: { html: 'ejs' } }));
app.use(bodyParser());

router.get('/', async (ctx, next) => {
    await ctx.render('index');
});

router.get('/add', async (ctx) => {
    let title = "hello koa2";
    await ctx.render('index', { title });
});


router.post('/doAdd', async (ctx) => {
    console.log(ctx.request.body);
    ctx.body = ctx.request.body;
});

app.use(router.routes());
app.use(router.allowedMethods());


app.listen(3000, () => {
    console.log("Start at port 3000");
});