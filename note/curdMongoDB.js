const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';

const dbName = 'koa';

const client = new MongoClient(url);


client.connect(err => {
    assert.equal(null, err);

    console.log('Connented successfully to server');

    const db = client.db(dbName);
    console.time("start");
    //增加数据
    db.collection('user').insertOne({'username': "张三2", 'sex': "男", 'age': 24}, (err,result)=>{
        if(!err){
            console.timeEnd("start");
            console.log("增加数据成功");
        }
    })
    client.close();
});