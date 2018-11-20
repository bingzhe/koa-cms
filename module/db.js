// BD库
const MongoDB = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = MongoDB.ObjectID;

const Config = require('./config.js');

// const url = 'mongodb://localhost:27017';

class DB {

    static getInstance() {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance;
    }

    constructor() {
        this.dbClient = null;
        this.connect();
    }

    connect() {
        return new Promise((resolve, reject) => {
            if (!this.dbClient) {
                const client = new MongoClient(Config.dbUrl);
                client.connect(err => {
                    if (err) {
                        reject(err);
                    } else {
                        this.dbClient = client.db(Config.dbName)
                        resolve(this.dbClient);
                    }
                })
            } else {
                resolve(this.dbClient);
            }
        });
    }


    /**
     * 查找
     * @param {String} collectionName 表名
     * 
     * DB.find('user', {}); 返回所有数据
     * DB.find('user', {}, {title:1}); 返回所有数据，只返回一列
     * DB.find('user', {}, {title:1}, {page:2, pageSize:20}); 返回第二页的数据
     * 
     */
    find(collectionName, json1, json2, json3) {

        let argumentsNum = arguments.length;
        let attr = {};
        let slipNum = 0;
        let pageSize = 0;

        switch (argumentsNum) {
            case 2:
                attr = {};
                slipNum = 0;
                pageSize = 0;
                break;
            case 3:
                attr = json2;
                slipNum = 0;
                pageSize = 0;
                break;
            case 4:
                let page = json3.page || 1;

                attr = json2;
                pageSize = json3.pageSize || 20;
                slipNum = (page - 1) * pageSize;
                break;
            default:
                console.log("传入参数错误");
                break;
        }


        return new Promise((resolve, reject) => {
            this.connect().then(db => {

                let result = db.collection(collectionName)
                    .find(json1, { fields: attr })
                    .skip(slipNum)
                    .limit(pageSize);

                result.toArray((err, docs) => {
                    if (err) {
                        reject(err);
                        return
                    }

                    resolve(docs);
                });
            });
        });
    }



    /**
     * 插入数据
     * @param {String} collectionName 表名
     * @param {*} json 插入数据
     */
    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).insertOne(json, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(result);
                });
            });
        });
    }

    /**
     * 更新
     * @param {String} collectionName 表名
     * @param {*} json1 查找条件
     * @param {*} json2 更新的数据
     */
    update(collectionName, json1, json2) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).updateOne(json1, { $set: json2 }, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            });
        });
    }

    remove(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).removeOne(json, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(result);
                });
            });
        });
    }

    getObjectId(id) {
        return new ObjectID(id);
    }

    /**
     * 统计数量的方法
     * @param {*} collectionName 
     * @param {*} json 
     */
    count(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {

                let result = db.collection(collectionName).count(json);
                result.then(function (count) {
                    resolve(count);
                });
            })
        })

    }

}


module.exports = DB.getInstance();