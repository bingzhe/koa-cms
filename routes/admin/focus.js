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
    let result = await DB.find('focus', {});

    await ctx.render('admin/focus/list', { list: result });
});

router.get('/add', async (ctx) => {
    await ctx.render('admin/focus/add');
});

router.post('/doAdd', upload.single('pic'), async (ctx) => {

    let title = ctx.req.body.title;
    let pic = ctx.req.file ? ctx.req.file.path.substr(7) : "";
    let url = ctx.req.body.url;
    let sort = ctx.req.body.sort;
    let status = ctx.req.body.status;
    let add_time = tools.getTime();

    let json = {
        title, pic, url, sort, status, add_time
    };

    await DB.insert('focus', json);

    ctx.redirect(ctx.state.__HOST__ + '/admin/focus');
});


//编辑
router.get('/edit', async (ctx) => {
    let id = ctx.query.id;
    let result = await DB.find('focus', { '_id': DB.getObjectId(id) });

    await ctx.render('admin/focus/edit', {
        list: result[0],
        prevPage: ctx.state.G.prevPage
    });
});

//执行编辑数据
router.post('/doEdit', upload.single('pic'), async (ctx) => {

    let id = ctx.req.body.id;
    let title = ctx.req.body.title;
    let pic = ctx.req.file ? ctx.req.file.path.substr(7) : '';
    let url = ctx.req.body.url;
    let sort = ctx.req.body.sort;
    let status = ctx.req.body.status;
    let add_time = tools.getTime();
    let prevPage = ctx.req.body.prevPage;


    if (pic) {
        var json = {
            title, pic, url, sort, status, add_time
        }
    } else {
        var json = {
            title, url, sort, status, add_time
        }

    }
    await DB.update('focus', { '_id': DB.getObjectId(id) }, json);


    if (prevPage) {
        ctx.redirect(prevPage);
    } else {
        //跳转
        ctx.redirect(ctx.state.__HOST__ + '/admin/focus');

    }

})


module.exports = router.routes();