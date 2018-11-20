const router = require('koa-router')();
const DB = require('../../module/db.js');
const tools = require('../../module/tools.js');

router.get('/', async (ctx) => {
    let result = await DB.find('article', {});

    let list = tools.cateToList(result);

    await ctx.render('admin/article/list', { list: list });
});

router.get('/add', async (ctx) => {
    //获取一级分类
    // let result = await DB.find('article', { 'pid': '0' });
    // await ctx.render('admin/article/add', { catelist: result });
    ctx.body = "增加文章";
});


module.exports = router.routes();