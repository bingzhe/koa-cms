// BD库
const MongoClient = require('mongodb').MongoClient;
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
     * @param {*} json 查找条件
     */
    find(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                const collection = db.collection(collectionName);

                collection.find(json).toArray((err, docs) => {
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

}


module.exports = DB.getInstance();