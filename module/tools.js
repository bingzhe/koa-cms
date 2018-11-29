const md5 = require('md5');
//上传图片的模块
const multer = require('koa-multer');

let tools = {
    md5(str) {
        return md5(str);
    },
    getTime() {
        return new Date();
    },
    //分类结构转换
    cateToList(data) {
        let resultList = [];

        data.forEach(item => {
            if (item.pid === "0") {
                resultList.push(item);
            }
        });


        resultList.forEach(element => {
            element.list = [];
            data.forEach(item => {
                if (element._id == item.pid) {
                    element.list.push(item)
                }
            });
        });

        return resultList;
    },
    multer() {  /*上传图片的配置*/
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/upload')
            },
            filename: function (req, file, cb) {
                var fileFormat = (file.originalname).split(".");   /*获取后缀名  分割数组*/
                cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        })
        var upload = multer({ storage: storage });
        return upload
    },
};

module.exports = tools;