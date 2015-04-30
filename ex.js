var bayes = require('./bayes')

var classifier = bayes()

classifier.learn('amazing, awesome movie!! Yeah!! Oh boy.', 'positive')
classifier.learn('Sweet, awesome , this is incredibly, amazing, perfect, great!!', 'positive')
classifier.learn('Sweet, awesome , this is incredibly, amazing, perfect, great!!', 'positive')
classifier.learn('awesome ', 'positive')
//classifier.learn('awesome ', 'positive')
//classifier.learn('awesome ', 'positive')

// teach it a negative phrase
//the valuse of word decrese with the growth of the positive/negative array

classifier.learn('terrible , shitty thing. Damn. Sucks!!', 'negative')
classifier.learn('terrible ,' ,'negative')
classifier.learn('terrible ,', 'negative')


// now ask it to categorize a document it has never seen before

console.log( classifier.categorize('terrible but awesome'))

console.log( classifier.totalDocuments)

console.log( classifier.wordFrequencyCount)

// => 'positive'
