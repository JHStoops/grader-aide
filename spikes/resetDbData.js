const MongoClient = require('mongodb').MongoClient;
const data = require('../public/Courses.json');
const ip = '192.168.99.100';
const port = '32773';

console.log('Connecting to MongoDB...');
MongoClient.connect(`mongodb://${ip}:${port}`, function (err, client) {
    if (err) console.log(err);
    console.log('Connected to MongoDB!');
    const db = client.db('graderaide-db');

    //Reset the courses collection
    db.createCollection('courses', function (err) {
        if (err) console.log(err);
        //Ignores creation request if collection already exists

        const col = db.collection('courses');
        col.deleteMany({}).then(function () {
            col.insertMany(data, function (err) {
                if (err) console.log(err);

                col.find({}).toArray(function (err, documents) {
                    console.log(documents);
                    client.close();
                });
            }); //End of insertMany
        }); // End of deleteMany
    });

});
