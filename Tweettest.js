var Twitter = require('twitter');

var bayes = require('./bayes');

var classifier = bayes();
var x = 3;
var tweetPost = "set";

//Positive stuff:

classifier.learn('amazing, awesome movie!! Yeah!! Oh boy.', 'positive');
classifier.learn('Sweet, awesome , this is incredibly, amazing, perfect, great!!', 'positive');
classifier.learn('fun ', 'positive');
classifier.learn('great ', 'positive');
classifier.learn('love it ', 'positive');
classifier.learn('love ', 'positive');
classifier.learn('I like it, good stuff ', 'positive');
classifier.learn('happy ', 'positive');



//Negative stuff:

classifier.learn('terrible , shitty thing. Damn. Sucks!!', 'negative');
classifier.learn('not good', 'negative');
classifier.learn('nooooo', 'negative');
classifier.learn('awful', 'negative');


var client = new Twitter({
  consumer_key: 'bwy2OwQPRJDcu95gJAsRY9l5S',
  consumer_secret: 'XX2jb3jX97dSGPCRyZi8TVDKxLsShnbmrBbG3LqNmOaNcSet1Y',
  access_token_key: '3182886140-UPKCn7tNY2gcxs5AvW7lBjRtDLCheOqkDtQSRus',
  access_token_secret: 'LF5OxrMlmI5mtRdEcqP3MPSWbRBvD6vIgyNpY3Mp8t2uJ'
});


//var util = require('util');

//client.get('search/tweets', {q: 'use'} , function(error, tweets, response){
//   console.log(tweets);
//   console.log(error);
//});

client.stream('statuses/filter', {track: 'love'}, function(stream){

  stream.on('data', function(data){
    if ((data.user.lang == 'en') && (data.lang == 'en')){
      console.log('new Message:');
      console.log(data.text);
      console.log(data.created_at);
      //console.log(data.lang);
      //console.log(data.user.lang);
      tweetPost = classifier.categorize(data.text);
      console.log(tweetPost);
      //console.log(data);
      x--;
      tweetPost = x+'';
      client.post('statuses/update', {status: " " + tweetPost }, function(error, tweet, response){
        if (!error) {
          console.log(tweet.text);
        }
      });
    }
    if (x == 0){
      stream.destroy();
      process.exit(0);
    }
  });

});

//how to use bayes and train it?
//by taking a tweet then asking after every tweet (manually)
//when asking, the answer should + or -, then after that the bayer code should learn
//but how to save what learned in a file? so that it can be revisited
//

//It's hard to tell if a tweet is about the movie or just using the words of the movie
//for example a movie called "home", is impossible.
//but if we use the a another set of words that tell if the tweet is about the movie or not.

//the categorization is case sensitive

