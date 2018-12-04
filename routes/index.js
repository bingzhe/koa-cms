const router = require('koa-router')();
const DB = require('../module/db.js');
const url = require('url');

//配置全局
router.use(async (ctx, next) => {
    let pathname = url.parse(ctx.request.url).pathname;

    //导航条的数据
    let navResult = await DB.find('nav', { $or: [{ 'status': 1 }, { 'status': '1' }] }, {}, {
        sortJson: { 'sort': 1 }
    });

    //模板引擎配置全局的变量
    ctx.state.nav = navResult;
    ctx.state.pathname = pathname;

    await next();
});

router.get('/', async (ctx) => {

    let focusResult = await DB.find('focus', {}, {}, { sortJson: { 'sort': 1 } });

    ctx.render('default/index', {
        focus: focusResult
    });
});

router.get('/news', async (ctx) => {
    ctx.render('default/news');
});


router.get('/service', async (ctx) => {
    //查询开发服务下的文章
    let serviceList = await DB.find('article', { "pid": '5c05f9413794e800e8d8bce6' });
    ctx.render('default/service', { serviceList });
});

router.get('/about', async (ctx) => {
    ctx.render('default/about');
});

router.get('/case', async (ctx) => {
    ctx.render('default/case');
});

router.get('/connect', async (ctx) => {
    ctx.render('default/connect');
});

router.get('/content/:id', async (ctx) => {
    console.log(ctx.params);
    ctx.body = ctx.params;

    let id = ctx.params.id;
    let content = await DB.find('article', { _id: DB.getObjectId(id) });

    ctx.render('default/content', { list: content[0] });

});

module.exports = router.routes();