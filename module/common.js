
exports.getPostData = function (ctx) {
    //异步获取数据

    return new Promise((resolve, reject) => {
        try {
            let str = "";
            ctx.req.on('data', chunk => {
                str += chunk;
            });
            ctx.req.on('end', chunk => {
                resolve(str);
            })
        } catch (error) {
            reject(error);
        }
    })
};