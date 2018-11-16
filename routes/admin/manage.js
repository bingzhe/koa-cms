const router = require('koa-router')();

const DB = require('../../module/db.js');
const tools = require('../../module/tools.js');

router.get('/', async (ctx) => {
    let result = await DB.find('admin', {});

    await ctx.render('admin/manage/list', {
        list: result
    });
});

router.get('/add', async (ctx) => {
    await ctx.render('admin/manage/add');
});

router.post('/doAdd', async (ctx) => {
    /**
     * 1.获取表单提交的数据
     * 2.验证表单数据
     * 3.检查要增加的管理员是否已经存在
     * 4.保存到数据库
     */

    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let rpassword = ctx.request.body.rpassword;

    if (!/[\u4e00-\u9fa5\w]{4,20}/.test(username)) {
        await ctx.render('admin/error', {
            message: '用户名不合法',
            redirect: ctx.state.__HOST__ + '/admin/manage/add'
        })
    } else if (password !== rpassword) {
        await ctx.render('admin/error', {
            message: '密码和确认密码不一致',
            redirect: ctx.state.__HOST__ + '/admin/manage/add'
        })
    } else if (password.length < 6) {
        await ctx.render('admin/error', {
            message: '密码不合法,必须大于等于6位',
            redirect: ctx.state.__HOST__ + '/admin/manage/add'
        })
    } else {

        let findResult = await DB.find('admin', { username: username });

        if (findResult.length > 0) {
            await ctx.render('admin/error', {
                message: '该管理员已经存在',
                redirect: ctx.state.__HOST__ + '/admin/manage/add'
            })
        } else {
            let manageInfo = {
                username: username,
                password: tools.md5(password),
                status: 1,
            }
            let addResult = await DB.insert('admin', manageInfo);

            ctx.redirect(ctx.state.__HOST__ + '/admin/manage');
        }
    }
});


router.get('/edit', async (ctx) => {
    // ctx.body = "编辑用户";
    let id = ctx.query.id;
    let result = await DB.find('admin', { _id: DB.getObjectId(id) });

    await ctx.render('admin/manage/edit', {
        list: result[0],
    })
});

router.post('/doEdit', async (ctx) => {

    let id = ctx.request.body.id;
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let rpassword = ctx.request.body.rpassword;

    if (!!password) {
        if (password !== rpassword) {
            await ctx.render('admin/error', {
                message: '密码和确认密码不一致',
                redirect: ctx.state.__HOST__ + '/admin/manage/edit?id=' + id
            });
        } else if (password.length < 6) {
            await ctx.render('admin/error', {
                message: '密码不合法,必须大于等于6位',
                redirect: ctx.state.__HOST__ + '/admin/manage/edit?id=' + id
            });
        } else {
            //更新密码
            let result = DB.update('admin', { _id: DB.getObjectId(id) }, { password: tools.md5(password) });
            ctx.redirect(ctx.state.__HOST__ + '/admin/manage');
        }
    } else {
        ctx.redirect(ctx.state.__HOST__ + '/admin/manage');
    }

});

router.get('/delete', async (ctx) => {
    ctx.body = "删除用户";
});

module.exports = router.routes();