const koa = require('koa');
const router = require('koa-router')();
const render = require('koa-art-template');
const path = require('path');
const static = require('koa-static');

const app = new koa();

//配置模板
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

//配置静态资源的中间件
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

