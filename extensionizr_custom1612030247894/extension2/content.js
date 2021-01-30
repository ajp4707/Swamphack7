function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Load wink-pos-tagger.
var posTagger = require( 'wink-pos-tagger' );

// Create an instance of the pos tagger.
var tagger = posTagger();

var elements = document.getElementsByTagName('*');

var nounlist = [];

//First loop finds all the nouns and adds to nounlist
for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    if (element.nodeType === 1)
	    for (var j = 0; j < element.childNodes.length; j++) {
	        var node = element.childNodes[j];
	
	        if (node.nodeType === 3) {
	            var text = node.nodeValue;
	            
	            var arr = tagger.tagSentence(text);
	            
	           for (var k = 0; k < arr.length && nounlist.length <= 50; k++){
	            	if (arr[k].pos === 'NN')
	            		nounlist.push(arr[k].value);
	            }
        }
    }
}

var nounlistcopy = ['Dummy'];
for (var i = 0; i < nounlist.length; i++)
	nounlistcopy.push(nounlist);
shuffle(nounlist);

//Second loop replaces the nouns
for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];

        if (node.nodeType === 3) {
        	for (var k = 0; k < nounlist.length; k++){
	            var text = node.nodeValue;
	            
	            var replacedText = text.replace(nounlist[k], nounlistcopy[k]);
	
	            if (replacedText !== text) {
	                //element.replaceChild(document.createTextNode(replacedText), node);
	                node.replaceWith(document.createTextNode(replacedText));
	            	}
            }
        }
    }
}
