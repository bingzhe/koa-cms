const router = require('koa-router')();
const DB = require('../../module/db.js');

router.get('/', async (ctx) => {
    await ctx.render('admin/index');
});

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

module.exports = router.routes();