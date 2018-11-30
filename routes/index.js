const router = require('koa-router')();
const DB = require('../module/db.js');

router.get('/', async (ctx) => {

    let navResult = await DB.find('nav', {}, {}, { sortJson: { 'sort': 1 } });
    let focusResult = await DB.find('focus', {}, {}, { sortJson: { 'sort': 1 } });

    ctx.render('default/index', {
        nav: navResult,
        focus: focusResult
    });
});

router.get('/news', async (ctx) => {
    ctx.render('default/news');
});
router.get('/service', async (ctx) => {
    ctx.render('default/service');
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

module.exports = router.routes();