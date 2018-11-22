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
    //查询分类数据
    let catelist = await DB.find('articlecate', {});

    await ctx.render('admin/article/add', {
        catelist: tools.cateToList(catelist)
    });

});

router.post('/doAdd', upload.single('img_url'), async (ctx) => {

    let pid = ctx.req.body.pid;
    let catename = ctx.req.body.catename.trim();
    let title = ctx.req.body.title.trim();
    let author = ctx.req.body.author.trim();
    let pic = ctx.req.body.author;
    let status = ctx.req.body.status;
    let is_best = ctx.req.body.is_best;
    let is_hot = ctx.req.body.is_hot;
    let is_new = ctx.req.body.is_new;
    let keywords = ctx.req.body.keywords;
    let description = ctx.req.body.description || '';
    let content = ctx.req.body.content || '';
    let img_url = ctx.req.file ? ctx.req.file.path : '';

    let json = {
        pid, catename, title, author, status, is_best, is_hot, is_new, keywords, description, content, img_url
    }

    var result = DB.insert('article', json);

    //跳转
    ctx.redirect(ctx.state.__HOST__ + '/admin/article');
});

module.exports = router.routes();