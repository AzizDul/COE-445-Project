/**
 * Created by Adnan on 5/19/2015.
 */

var mongodb = require('mongodb');

// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname

var uri = 'mongodb://RateMyMovie:123456@ds031661.mongolab.com:31661/heroku_app36793566';
//var uri ='mongodb://localhost:27017/myDB'

var training;


mongodb.MongoClient.connect(uri, function(err, db) {
    MAINDB=db;
    if (err) console.log('Error in Connecting to DB'); else console.log('Connected to DB');

     training = db.collection('training');

});


 exports.AddtoDB = function (req,res) {

training.insert(req, function(err, result) {

    if (err) throw err;

});

}

exports.getTrainingSet = function(reg,res) {

    training.find().toArray(function (err2, docs) {

        if (err2) throw err2;
        //console.log(docs);
        res(docs);
    })


}
