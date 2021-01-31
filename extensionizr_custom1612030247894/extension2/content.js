var isNoun = function ( word ) {
    const index = words[ word ];
    if ( index === undefined ) return false;
    const senses = senseMap[ index ];
    for ( let k = 0; k < senses.length; k += 1 ) {
        if ( senses[ k ] > 2 && senses[ k ] < 29  )
            return true;
    }
    return false;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex) {

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
console.log("Array of elems looks like this");
console.log(elements);
var nounlist = [];

var nodelist = [];
var goodElemsList = ["BODY", "DIV", "P", "A", "LABEL", "BUTTON", "H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL", "LI", "NAV", "FOOTER", "HEADER" ];
//First loop finds all the nouns and adds to nounlist

for (var i = 0; i < elements.length; i++)
	if(elements[i].nodeType === 1 && goodElemsList.includes(elements[i].nodeName))
	for (var j = 0; j < elements[i].childNodes.length; j++) {
	    var node = elements[i].childNodes[j];
	
	    if (node.nodeType === 3 && node.nodeValue.trim()) {
	        var text = node.nodeValue.trim();
	        
	        var arr = tagger.tagSentence(text);
	        console.log("Tagger found:")
	        console.log(arr);
	        for (var k = 0; k < arr.length && nounlist.length <= 500; k++){
	        	if (arr[k].pos === "NN" || arr[k].pos === "NNP" ||arr[k].pos === "NNS"){
	        		nounlist.push(arr[k].value);
	        		nodelist.push(node);
	        	}
	        }
	    }
	}

const unique = (value, index, self) => {
	return self.indexOf(value) === index
}

const uniquenouns = nounlist.filter(unique)

console.log("Nounlist looks like:")
console.log(uniquenouns);
var nounlistshuffled = [];
for (var i = 0; i < nounlist.length; i++)
	nounlistshuffled.push(nounlist[i]);
shuffle(nounlistshuffled);

console.log("Replacing elems now");
for (var i = 0; i < nounlist.length; i++) {
	var node2 = nodelist[i];
	var text = node2.nodeValue;
	var replacedText = text.replace(nounlist[i], nounlistshuffled[i]);
	if (replacedText !== text)
		node2.replaceWith(document.createTextNode(replacedText));

	var nounlist = [];

	var element, node, text, arr, replacedText;

//First loop finds all the nouns and adds to nounlist
	for (var i = 0; i < elements.length; i++) {
		element = elements[i];
		if (element.nodeType === 1)
			for (var j = 0; j < element.childNodes.length; j++) {
				node = element.childNodes[j];

				if (node.nodeType === 3) {
					text = node.nodeValue;
					arr = tagger.tagSentence(text);

					for (var k = 0; k < arr.length && nounlist.length <= 50; k++) {
						if (isNoun(arr[k]))
							nounlist.push(arr[k].value);
					}
				}
			}
	}

	var nounlistcopy = ['Dummy'];
	for (var i = 0; i < nounlist.length; i++)
		nounlistcopy.push(nounlist[i]);
	shuffle(nounlist);

//Second loop replaces the nouns
	for (var i = 0; i < elements.length; i++) {
		element = elements[i];

		for (var j = 0; j < element.childNodes.length; j++) {
			node = element.childNodes[j];

			if (node.nodeType === 3) {
				for (var k = 0; k < nounlist.length; k++) {
					text = node.nodeValue;

					replacedText = text.replace(nounlist[k], nounlistcopy[k]);

					if (replacedText !== text) {
						//element.replaceChild(document.createTextNode(replacedText), node);
						node.replaceWith(document.createTextNode(replacedText));
					}
				}
			}
		}
	}
}