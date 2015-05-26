/**
 * Created by Adnan on 5/20/2015.
 */
// essitneal modules
var express = require('express');
var app = require('express')(),
    swig = require('swig'),
    people;
var bodyParser = require('body-parser');
app.use(bodyParser());

///----------------------------------
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

///---------------------------------- Twitter module
var Twit = require('twit');
//----------------------------------------- Bayes stuff
var bayes = require('./bayes');

var classifier = bayes();
//----------------------------------------- keys
var T = new Twit({
    consumer_key:         'bwy2OwQPRJDcu95gJAsRY9l5S'
    , consumer_secret:      'XX2jb3jX97dSGPCRyZi8TVDKxLsShnbmrBbG3LqNmOaNcSet1Y'
    , access_token:         '3182886140-UPKCn7tNY2gcxs5AvW7lBjRtDLCheOqkDtQSRus'
    , access_token_secret:  'LF5OxrMlmI5mtRdEcqP3MPSWbRBvD6vIgyNpY3Mp8t2uJ'
});

//------------------------------------ data base
var database = require('./mongolab');
//------------------------------------ Template modules
var request = require("request")
var path = require('path');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/');
app.use("/css", express.static(path.join(__dirname, '/css')));
app.use("/images", express.static(path.join(__dirname, '/images')));

app.set('view cache', false);
swig.setDefaults({ cache: false });

//------------------------------------
var array = []; /// temp array to store the tweets
app.use(bodyParser.urlencoded({extended: true}));







// Routes
// Handlers for the REST APIs

app.get('/', function(req, res) {
    res.sendfile("index.html");
  //  res.render('single', {title: 'TEST!!!!',src:__dirname + '/' });
});

app.get('/404', function(req, res) {
    res.sendfile("404.html");
    //  res.render('single', {title: 'TEST!!!!',src:__dirname + '/' });
});

app.get('/contact', function(req, res) {
    res.sendfile("contact.html");
    //  res.render('single', {title: 'TEST!!!!',src:__dirname + '/' });
});


////////////////////////////////////////////////////////////////////////////////
app.get('/movie/:movie_name', function(req, res){

    var url = "http://www.omdbapi.com/?t="+req.params.movie_name+"&y=&plot=short&r=json";

    request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            if(body.Response=='True') {
                console.log(body) // Print the json response

                rating(req.params.movie_name, function(returnValue) {
                   // var htmlObject = $(returnValue[0].tweets);

                    res.render('single', {title: body.Title,
                        date:body.Released
                        ,RMM_RATING:returnValue[0].rating
                        ,imdb_RATING:body.imdbRating
                        ,cast:body.Actors
                        ,DIRECTION:body.Director
                        ,genre: body.Genre
                        ,runtime:body.Runtime
                        ,awards:body.Awards
                        ,plot:body.Plot
                        ,sample_tweets:returnValue[0].tweets
                        ,src:__dirname + '/' });
                    console.log(returnValue);
                });



            } else

                res.sendfile("not_found.html");
        }
    })
});

app.post('/movie', function(req, res){

    var url = "http://www.omdbapi.com/?t="+req.body.user.search_text+"&y=&plot=short&r=json";

    request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            if(body.Response=='True') {
                console.log(body) // Print the json response

                rating(req.body.user.search_text, function(returnValue) {
                    res.render('single', {title: body.Title,
                        date:body.Released
                        ,RMM_RATING:returnValue[0].rating
                        ,imdb_RATING:body.imdbRating
                        ,cast:body.Actors
                        ,DIRECTION:body.Director
                        ,genre: body.Genre
                        ,runtime:body.Runtime
                        ,awards:body.Awards
                        ,plot:body.Plot
                        ,sample_tweets:returnValue[0].tweets
                        ,src:__dirname + '/' });
                    console.log(returnValue);
                });



            } else

                res.sendfile("not_found.html");
        }
    })



});






//////////////////////////////////////////////////////////////////////////////////////////////////



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

    var tweets = [];
    var tweetsCount = 0;
    var pos=0;
    var neg=0;

    res.setHeader('content-type', 'text/html');

    FetechTweets("just watched "+req.params.movie_name, function(returnValue) {

        res.write('<B>using keyword (just watched)</B> '+req.params.movie_name+' with classifications'+"<BR><BR><BR>");

        for(var id in returnValue){
            try{
            if (tweets.indexOf(returnValue[id].text) > -1) {
                res.write("<BR>"+returnValue[id].text +" CLASS: "+ "repeated"+ "<BR><BR>");

            } else {

            if(classifier.categorize(returnValue[id].text)=="positive") pos++
            if(classifier.categorize(returnValue[id].text)=="negative") neg++;
            res.write("<BR>"+returnValue[id].text +" CLASS: "+ classifier.categorize(returnValue[id].text)+ "<BR><BR>");
                tweetsCount++;
                tweets[tweetsCount] = returnValue[id].text;
            }
        }catch(err) {   console.log( err.message);
            }}

        FetechTweets("watched "+req.params.movie_name, function(returnValue) {

            res.write('<B>using keyword (watched)</B> '+req.params.movie_name+' with classifications'+"<BR><BR><BR>");

            for(id = 0; id < 10; id++){
                try {
                if (tweets.indexOf(returnValue[id].text) > -1) {
                    res.write("<BR>" + returnValue[id].text + " CLASS: " + "repeated" + "<BR><BR>");
                }else {
                if(classifier.categorize(returnValue[id].text)=="positive") pos++
                if(classifier.categorize(returnValue[id].text)=="negative") neg++;
                res.write("<BR>"+returnValue[id].text +" CLASS: "+ classifier.categorize(returnValue[id].text)+ "<BR><BR>");
                tweetsCount++;
                tweets[tweetsCount] = returnValue[id].text;
                }
            }catch(err) {   console.log( err.message);
                }
            }

            res.end("Positive count: " + pos + " negative count: "+neg + " Rating:" +(pos/(pos+neg)*10));
        });



    });





});


app.get('/training/:author', function(req, res){

    res.setHeader('content-type', 'text/html');

    FetechTweets(req.params.author, function(returnValue) {
        for(var id in returnValue){
            array[id] = returnValue[id].text;
            res.write("<BR>"+returnValue[id].text + "<BR><BR>");
            res.write("<select name=\"user[tweet"+id+"]\">");
            res.write("  <option value=\"delete\">Ignore [Do not add to Database]<\/option>");
            res.write("  <option value=\"positive\">Positive +++<\/option>");
            res.write("  <option value=\"negative\">Negative ---<\/option>");
            res.write("  <option value=\"ignore\">Ignore [Add to DataBase]<\/option>");
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

    T.get('search/tweets', { q: query+" since:2011-11-11", count: 50 }, function(err, data, response) {
        //  console.log(data) /////////////// print the json object
        //console.log(query);
        //  console.log(data.statuses[0].text); /////// get the text of the first element in the json object
        //  console.log(data);
        try{
      if(data.statuses!=null)
        callback(data.statuses);
        }catch(err) {}
        //connect to DB

    });

}



function rating(query,callback) {
    var tweets = [];
    var tweetsCount = 0;
    var pos=0;
    var neg=0;

    var posTweet = 0;
    var negTweet = 0;

    var HTML="";

    FetechTweets("just watched "+query, function(returnValue) {



        for(var id in returnValue){
            try{
                if (tweets.indexOf(returnValue[id].text) > -1) {

                } else {
                    if(classifier.categorize(returnValue[id].text)=="positive") {
                       if(posTweet<10){
                           HTML +='<p style="color:#51A920">'+returnValue[id].user.name+": "+returnValue[id].text+'</p><BR>';
                           posTweet++;
                       }
                        pos++
                    };
                    if(classifier.categorize(returnValue[id].text)=="negative"){
                        if(negTweet<10){
                            HTML +='<p style="color:#FF0000">'+returnValue[id].user.name+": "+returnValue[id].text+'</p><BR>';
                            negTweet++;
                        }
                        neg++};
                    tweetsCount++;
                    tweets[tweetsCount] = returnValue[id].text;
                }
            }catch(err) {   console.log( err.message);
            }}

        FetechTweets("watched "+query, function(returnValue) {

            for(id = 0; id < 10; id++){
                try {
                    if (tweets.indexOf(returnValue[id].text) > -1) {
                    }else {
                        if(classifier.categorize(returnValue[id].text)=="positive") pos++
                        if(classifier.categorize(returnValue[id].text)=="negative") neg++;
                        tweetsCount++;
                        tweets[tweetsCount] = returnValue[id].text;
                    }
                }catch(err) {   console.log( err.message);
                }
            }

            var returnData = [
                {
                    rating: (pos / (pos + neg) * 10),
                      tweets: HTML,
                    tweetsCount:tweetsCount
                }
            ];
            console.log(returnData);
            console.log(HTML);
            callback(returnData);
        });

            // res.end("Positive count: " + pos + " negative count: "+neg + " Rating:" +(pos/(pos+neg)*10));


});
}


