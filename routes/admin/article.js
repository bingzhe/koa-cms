const router = require('koa-router')();
const DB = require('../../module/db.js');
const tools = require('../../module/tools.js');

//图片上传的模块
const multer = require('koa-multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload'); //配置图片上传的目录
    },
    filename: function (req, file, cb) {   /*图片上传完成重命名*/
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
let upload = multer({ storage: storage });


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

    await ctx.render('admin/article/add');

});

router.post('/doAdd', upload.single('pic'), async (ctx) => {
    ctx.body = {
        filename: ctx.req.file.filename,
        body: ctx.req.body
    }
});

module.exports = router.routes();