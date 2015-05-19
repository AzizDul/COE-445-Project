/**
 * Created by Adnan on 5/19/2015.
 */

var mongodb = require('mongodb');


// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname
var uri = 'mongodb://RateMyMovie:123456@ds031661.mongolab.com:31661/heroku_app36793566';
//var uri ='mongodb://localhost:27017/myDB'
var seedData = [
    {
        input: 'amazing, awesome movie!! Yeah!! Oh boy. 2',
        class: 'positive'
    }
];


mongodb.MongoClient.connect(uri, function(err, db) {
    MAINDB=db;
    if (err) console.log('Error in Connecting to DB'); else console.log('Connected to DB');

    var training = db.collection('training');




    console.log('trying to add');

    training.insert(seedData, function(err, result) {

        if (err) throw err;

    });


});

    /*
     * First we'll add a few songs. Nothing is required to create the
     * songs collection; it is created automatically when we insert.
     */


