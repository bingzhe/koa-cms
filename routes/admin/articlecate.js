const router = require('koa-router')();
const DB = require('../../module/db.js');
const tools = require('../../module/tools.js');

router.get('/', async (ctx) => {
    let result = await DB.find('articlecate', {});

    let list = tools.cateToList(result);

    await ctx.render('admin/articlecate/list', { list: list });
});

router.get('/add', async (ctx) => {
    //获取一级分类
    let result = await DB.find('articlecate', { 'pid': '0' });
    await ctx.render('admin/articlecate/add', { catelist: result });
});

router.post('/doAdd', async (ctx) => {
    let cateInfo = ctx.request.body;
    cateInfo.status = Number(cateInfo.status);

    let result = await DB.insert('articlecate', cateInfo);

    ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate');
});

router.get('/edit', async (ctx) => {

    let id = ctx.query.id;
    let result = await DB.find('articlecate', { _id: DB.getObjectId(id) });
    //获取一级分类
    let cateList = await DB.find('articlecate', { 'pid': '0' });

    await ctx.render('admin/articlecate/edit', {
        catelist: cateList,
        cateInfo: result[0]
    });
});

router.post('/doEdit', async (ctx) => {
    let cateInfo = ctx.request.body;
    let id = cateInfo.id;

    //删除要更新的id
    delete cateInfo.id

    cateInfo.status = Number(cateInfo.status);

    let result = await DB.update('articlecate', { _id: DB.getObjectId(id) }, cateInfo);

    ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate');
});


module.exports = router.routes();