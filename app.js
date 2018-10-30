const koa = require('koa');
const router = require('koa-router')();
const views = require('koa-views');


app.use(views('views', { map: { html: 'ejs' } }));

router.get('/', function (ctx, next) {
    ctx.body = "Hello koa";
});
router.get('/news', (ctx, next) => {
    ctx.body = "新闻页面";
});

app.use(router.routes());
app.use(router.allowedMethods());


app.listen(3000, () => {
    console.log("Start at port 3000");
});