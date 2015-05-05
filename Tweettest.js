var Twitter = require('twitter');

var bayes = require('./bayes');

var classifier = bayes();

//Positive stuff:

classifier.learn('amazing, awesome movie!! Yeah!! Oh boy.', 'positive');
classifier.learn('Sweet, awesome , this is incredibly, amazing, perfect, great!!', 'positive');
classifier.learn('Batman ', 'positive');
classifier.learn('Batman , good stuff ', 'positive');


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

client.stream('statuses/filter', {track: 'batman'}, function(stream){

  stream.on('data', function(data){
    console.log(data.text);
    console.log(classifier.categorize(data.text));
    stream.destroy();
    process.exit(0);

  });

});

client.get('search/tweets', {q: 'love'}, function(error, tweets, response){
   console.log(tweets);
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

