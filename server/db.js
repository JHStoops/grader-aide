const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const f = require('util').format;
const assert = require('assert');

//authentication
//FIXME: no username and password yet... ¯\_(ツ)_/¯
//const user = encodeURIComponent('bitnami');
//const password = encodeURIComponent('CS4690');
//const authMechanism = 'DEFAULT';

//connection url
//const url = f('mongodb://172.26.9.245/', user, password, authMechanism);

//db name
let mongodb;
const dbName = 'graderaide-db';
const ip = '172.17.0.2';
const port = 27017;

//For local testing
// const ip = '192.168.99.100';
// const port = '32773';

console.log('\nConnecting to MongoDB...');
MongoClient.connect(`mongodb://${ip}:${port}`, function(error, client){
    if (error) console.log(error);
    console.log('Connected to MongoDB.');
    mongodb = client.db(dbName);
});

// http://mongodb.github.io/node-mongodb-native/3.0/api
const Exports = {
    close: function(client){
        console.log('Closing MongoDB connection...')
        client.close();
    },
    getData: function(col, filterObj, optionsObj){
        //Returns Promise
        if (filterObj && filterObj.hasOwnProperty('_id')) filterObj._id = ObjectID(filterObj._id);
        return mongodb.collection(col).find(filterObj, optionsObj).toArray();
    },
    modifyData: function(col, filterObj, updateObj, options){
        //Returns Promise
        if (filterObj && filterObj.hasOwnProperty('_id')) filterObj._id = ObjectID(filterObj._id);
        return mongodb.collection(col).findOneAndUpdate(filterObj, updateObj, options);
    },
    setData: function(col, id, newObj) {
      //Returns Promise
        return mongodb.collection(col).findOneAndReplace({_id: ObjectID(id)}, newObj);
    },
    insertData: function(col, newObj) {
      //Returns Promise
        return mongodb.collection(col).insertOne(newObj);
    },
    removeData: function(col, id) {
          return mongodb.collection(col).deleteOne({_id: ObjectID(id)});
    }
};

module.exports = Exports;
