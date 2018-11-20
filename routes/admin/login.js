const router = require('koa-router')();
const tools = require('../../module/tools.js');
const DB = require('../../module/db.js');

//验证码
const svgCaptcha = require('svg-captcha');


router.get('/', async (ctx) => {
    await ctx.render("admin/login");
});


router.post('/doLogin', async (ctx) => {
    console.log(ctx.request.body);

    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let code = ctx.request.body.code;


    // 1.验证
    // 2.数据库匹配
    // 3. 成功之后用户信息写入session

    if (code.toLocaleLowerCase() === ctx.session.code.toLocaleLowerCase()) {
        //后台需要验证码是否合法


        let result = await DB.find('admin', { 'username': username, 'password': tools.md5(password) });

        if (result.length > 0) {
            //登录成功

            ctx.session.userinfo = result[0];

            //更新用户表
            await DB.update('admin', { _id: DB.getObjectId(result[0]._id) }, {
                last_time: new Date()
            })

            ctx.redirect(ctx.state.__HOST__ + '/admin');

        } else {
            ctx.render('admin/error', {
                message: '用户名或者密码错误',
                redirect: ctx.state.__HOST__ + '/admin/login'
            })
        }
    } else {
        ctx.render('admin/error', {
            message: '验证码错误',
            redirect: ctx.state.__HOST__ + '/admin/login'
        });
    }

});

//验证码
router.get('/code', async (ctx) => {
    let captcha = svgCaptcha.create({
        size: 4,
        fontSize: 50,
        ignoreChars: '0o1il',
        noise: 3,
        width: 120,
        height: 34,
        background: "#cc9966"
    });

    // 数字验证码
    // let captcha = svgCaptcha.createMathExpr({
    //     size: 4,
    //     fontSize: 50,
    //     width: 120,
    //     height: 34,
    //     background: "#cc9966"
    // });


    ctx.session.code = captcha.text;
    //设置响应头
    ctx.response.type = "image/svg+xml";
    ctx.body = captcha.data;
});


//退出登陆
router.get('/loginOut', async (ctx) => {
    ctx.session.userinfo = null;
    ctx.redirect(ctx.state.__HOST__ + '/admin/login');
});
module.exports = router.routes();