const router = require('koa-router')();
const DB = require('../../module/db.js');

router.get('/', async (ctx) => {
    await ctx.render('admin/index');
});

//更改
router.get('/changeStatus', async (ctx) => {

    let collectionName = ctx.query.collectionName;
    let attr = ctx.query.attr;
    let id = ctx.query.id;

    let result = await DB.find(collectionName, { _id: DB.getObjectId(id) });

    if (result.length > 0) {
        let json = null;
        if (result[0][attr] === 1) {
            json = {
                [attr]: 0
            }
        } else {
            json = {
                [attr]: 1
            }
        }

        let updateResult = await DB.update(collectionName, { _id: DB.getObjectId(id) }, json);

        if (updateResult) {
            ctx.body = { ret: 0, data: {} };
        } else {
            ctx.body = { ret: -1, data: {} };
        }
    } else {
        ctx.body = {
            ret: - 1, data: {}
        };
    }
});

//改变排序
router.get('/changeSort', async (ctx) => {
    let collectionName = ctx.query.collectionName;
    let sortValue = ctx.query.sortValue;
    let id = ctx.query.id;

    let result = await DB.find(collectionName, { _id: DB.getObjectId(id) });

    if (result.length > 0) {
        let json = { sort: sortValue };

        let updateResult = await DB.update(collectionName, { _id: DB.getObjectId(id) }, json);

        if (updateResult) {
            ctx.body = { ret: 0, data: {} };
        } else {
            ctx.body = { ret: -1, data: {} };
        }
    } else {
        ctx.body = {
            ret: - 1, data: {}
        };
    }

});
//删除
router.get('/remove', async (ctx) => {
    try {
        let collectionName = ctx.query.collectionName;
        let id = ctx.query.id;

        console.log(collectionName, id);
        let result = DB.remove(collectionName, { _id: DB.getObjectId(id) });

        //跳回上一页
        ctx.redirect(ctx.state.G.prevPage);
    } catch (error) {
        ctx.redirect(ctx.state.G.prevPage);

    }
});


module.exports = router.routes();