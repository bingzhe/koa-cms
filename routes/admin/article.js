const router = require('koa-router')();
const DB = require('../../module/db.js');
const tools = require('../../module/tools.js');

router.get('/', async (ctx) => {
    let page = ctx.query.page || 1;
    let pageSize = ctx.query.pageSize || 20;

    let result = await DB.find('article', {}, {}, {
        page: 1,
        pageSize: 20,
    });
    let count = await DB.count('article', {});

    await ctx.render('admin/article/list', {
        list: result,
        page: page,
        // totalPages: Math.ceil(count / pageSize)
        totalPages: 100
    });
});

router.get('/add', async (ctx) => {
    //获取一级分类
    // let result = await DB.find('article', { 'pid': '0' });
    // await ctx.render('admin/article/add', { catelist: result });
    ctx.body = "增加文章";
});


module.exports = router.routes();