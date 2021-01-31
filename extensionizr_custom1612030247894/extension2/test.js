// Load wink-pos-tagger.
var posTagger = require( 'wink-pos-tagger' );



// Create an instance of the pos tagger.
var tagger = posTagger();

// Tag the sentence using the tag sentence api.
var arr = tagger.tagSentence( 'A bear just crossed the road. How many people eat chicken? My name is Frank.' );

var nounlist = [];

for (var i = 0; i < arr.length; i++)
	nounlist.push(arr[i].value);

console.log(nounlist[0]);