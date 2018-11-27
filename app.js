const koa = require('koa');
const router = require('koa-router')();
const render = require('koa-art-template');
const path = require('path');
const static = require('koa-static');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const sd = require('silly-datetime');
const jsonp = require('koa-jsonp');

const app = new koa();

//配置session
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true,//每次请求都重新设置
    renew: false,
};
app.use(session(CONFIG, app));

//配置post提交数据的中间件
app.use(bodyParser());

//配置jsonp中间件
app.use(jsonp());

//配置模板
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat: dateFormat = function (value) {
        return sd.format(new
            Date(value), 'YYYY-MM-DD HH:mm');
    } /*扩展模板里面的方法*/
});

//配置静态资源的中间件
app.use(static('.'));
app.use(static(__dirname + '/public'));

//引入模块
const api = require('./routes/api.js');
const admin = require('./routes/admin');
const index = require('./routes/index.js');

router.use(index);
router.use('/admin', admin);
router.use('/api', api);


app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
    console.log("Start at port 3000");
});

