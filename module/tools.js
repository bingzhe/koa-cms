const md5 = require('md5');

let tools = {
    md5(str) {
        return md5(str);
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
    }
};

module.exports = tools;