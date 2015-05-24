/**
 * Created by Adnan on 5/20/2015.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser());

///----------------------------------
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

///----------------------------------


//------------------------------------
var array = []; /// temp array to store the tweets
//------------------------------------
var Twit = require('twit');
//-----------------------------------------
var bayes = require('./bayes');

var classifier = bayes();
//-----------------------------------------
var T = new Twit({
    consumer_key:         'bwy2OwQPRJDcu95gJAsRY9l5S'
    , consumer_secret:      'XX2jb3jX97dSGPCRyZi8TVDKxLsShnbmrBbG3LqNmOaNcSet1Y'
    , access_token:         '3182886140-UPKCn7tNY2gcxs5AvW7lBjRtDLCheOqkDtQSRus'
    , access_token_secret:  'LF5OxrMlmI5mtRdEcqP3MPSWbRBvD6vIgyNpY3Mp8t2uJ'
});

//------------------------------------
var database = require('./mongolab');
//------------------------------------
app.use(bodyParser.urlencoded({extended: true}));

// Routes
// Handlers for the REST APIs

app.get('/', function(req, res) {
    res.send("Index :)");
});


app.get('/commit', function(req, res){
    database.getTrainingSet("",function(returnValue) {
        for(var id in returnValue){
            if(returnValue[id].input!= null)
           classifier.learn(returnValue[id].input,returnValue[id].class);
           // console.log(returnValue[id].input+" "+returnValue[id].class);
        }
        console.log('Training is done');

       //res.send("CLASS:"+classifier.categorize("Just watched Mad Max Fury Road and it was pretty good"));
        res.send(returnValue);
    });

});


app.get('/rate/:movie_name', function(req, res){

    res.setHeader('content-type', 'text/html');

    FetechTweets(req.params.movie_name, function(returnValue) {

        res.write('Tweets for: '+req.params.movie_name+' with classifications'+"<BR><BR><BR>");

        for(var id in returnValue){

            res.write("<BR>"+returnValue[id].text +" CLASS: "+ classifier.categorize(returnValue[id].text)+ "<BR><BR>");

        }
        res.end();
    });
});





app.get('/training/:author', function(req, res){

    res.setHeader('content-type', 'text/html');

    FetechTweets(req.params.author, function(returnValue) {
        for(var id in returnValue){
            array[id] = returnValue[id].text;
                    res.write("<BR>"+returnValue[id].text + "<BR><BR>");
            res.write("<select name=\"user[tweet"+id+"]\">");
            res.write("  <option value=\"positive\">Positive +++<\/option>");
            res.write("  <option value=\"negative\">Negative ---<\/option>");
            res.write("  <option value=\"ignore\">Ignore [Add to DataBase]<\/option>");
            res.write("  <option value=\"delete\">Ignore [Do not add to Database]<\/option>");
            res.write("<\/select><BR>---------");
                }


        });
    res.write('<form method="post" action="/submit">');
    res.write('Welcome to training center<BR>');
        setTimeout(function(){

                res.end('End...<INPUT TYPE="submit" name="submit" /></form>')},
            8000);

   // });
});

app.post('/submit', function(req, res){


    res.setHeader('content-type', 'text/html');
     i = 0;

    for(var id in req.body.user){

        if(req.body.user[id]!="delete") {
        var seedData = [
            {
                input: array[i],
                class: req.body.user[id]
            }
        ];
      //  if( array[i].input!=null){
        database.AddtoDB(seedData,function(returnValue) {});
      //  }
        }
        res.write(array[i]+"  "+req.body.user[id]+"<BR>");
        i++;
    }
    res.end();

});


//-----------------------------------------------------

app.listen(app.get('port'), function(){
    console.log('Server listening at port '+ app.get('port'));
});


//
//  search twitter for all tweets containing the word 'banana' since Nov. 11, 2011
//


// movies to test:
// Inception
// godfather
// finding nemo


/// keywords to add:
// I think "movie name" ....
// "movie name" [is/was] ....
// "movie name" movie
// "movie name" film
// "movie name" just watched
function FetechTweets(query, callback)
{

    T.get('search/tweets', { q: "just watched "+query+" since:2011-11-11", count: 20 }, function(err, data, response) {
        //  console.log(data) /////////////// print the json object
        //console.log(query);
        //  console.log(data.statuses[0].text); /////// get the text of the first element in the json object
      //  console.log(data);
        callback(data.statuses);
        //connect to DB

    });





}