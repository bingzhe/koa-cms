class DB {

    static getInstance() {
        if (!DB.instance) {
            DB.instance = new DB();
        }

        return DB.instance;
    }

    constructor() {
        console.log("构造函数");
    }

    connect() {
        console.log('连接数据库')
    }

    find() {
        console.log("查询数据库");
    }
}