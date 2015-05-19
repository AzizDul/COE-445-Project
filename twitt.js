/**
 * Created by Adnan on 5/17/2015.
 */

var Twit = require('twit')

var T = new Twit({
    consumer_key:         'bwy2OwQPRJDcu95gJAsRY9l5S'
    , consumer_secret:      'XX2jb3jX97dSGPCRyZi8TVDKxLsShnbmrBbG3LqNmOaNcSet1Y'
    , access_token:         '3182886140-UPKCn7tNY2gcxs5AvW7lBjRtDLCheOqkDtQSRus'
    , access_token_secret:  'LF5OxrMlmI5mtRdEcqP3MPSWbRBvD6vIgyNpY3Mp8t2uJ'
})

var sys = require("sys");

var stdin = process.openStdin();

var movie_name;

console.log("Insert The Movie title: ");

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then substring()
    movie_name = d.toString().substring(0, d.length-2);
    console.log("you entered: [" + movie_name + "]");

    process.stdin.destroy();


    FetechTweets(movie_name, function(returnValue) {
        // use the return value here instead of like a regular (non-evented) return value
    });


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
T.get('search/tweets', { q: "just watched "+query+" since:2011-11-11", count: 10 }, function(err, data, response) {
  //  console.log(data) /////////////// print the json object
    //console.log(query);
  //  console.log(data.statuses[0].text); /////// get the text of the first element in the json object

 // loop thru the tweets and print the text
    for(var id in data.statuses){
        console.log('\n',data.statuses[id].text);
    }

});






}
