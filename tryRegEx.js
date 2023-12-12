// https://www.paulsblog.dev/manipulate-strings-with-regular-expression-in-javascript/
// https://regexgpt.app/
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_expressions


const paragraph = '#demo The quick brown fox jumps over the lazy dog. It barked.';
const paragraph2 = 'The quick brown fox jumps over the lazy dog. It barked.';
const paragraph3 = 'The #fox quick brown fox jumps over the lazy dog. It barked.';

const regexUppercase = /[A-Z]/g;
const regexFox = /fox/;
const regexTag = /^#$#/


function extractTag(str) {
    const regex = /#(\w+)/;
    const match = str.match(regex);
    return match ? match[1] : '';
}
  
function removeHashTag(str) {
    return str.replace(/#tag\s*/, '');
}

//console.log(paragraph.match(regexUppercase));	// Array ["T", "I"]
//console.log(paragraph.match(regexFox)); 		// Array ["fox"]

/*
const tag = extractTag(paragraph);
const text = paragraph.replace(`#${tag} `,'');//removeHashTag(paragraph); 
console.log(tag); // Output: 'tag'
console.log(text); // Output: 'tag'
*/

function parseTag(cText){
    let jsonResult={
        tag:'',
        text:''
    } ;
    const regex = /#(\w+)/;
    const match = cText.match(regex);
    jsonResult.tag = match ? match[1] : '';
    jsonResult.text = cText.replace(`#${jsonResult.tag} `,'');
    console.log(jsonResult)  ;
    return jsonResult ;
}

let jsonT = parseTag(paragraph) ;
console.log(jsonT) ;

jsonT =parseTag(paragraph2) ;
console.log(jsonT) ;

jsonT =parseTag(paragraph3) ;
console.log(jsonT) ;
console.log('------------------------------');

function extractIds(input) {
    const regex = /#(\w+)/g;
    const matches = input.match(regex);
    const ids = matches.map(match => match.slice(1));
    return ids.join(' ');
  }
  
  const input = '#demo1 #demo2 this is something fun';
  const result = extractIds(input);
  console.log(result); // Output: "demo1 demo2"
  console.log('------------------------------');


quizText='{{someone?I}} want to do {{something?this}}.'
quizText2='{{someone?we}} want to do {{something?that}}.'

function replacePlaceholders(str) {
    return str.replace(/{{([^?]+)\?([^}]+)}}/g, '$2');
}
console.log(replacePlaceholders(quizText2)) ;

console.log('------------------------------');


function replacePlaceholders_2(str, replacements) {
    return str.replace(/\{\{(\w+)\}\}/g, (_, key) => replacements[key]);
}
const input_1 = '{{P1}} want to do {{P2}}.';
const replacements = { P1: 'Ray', P2: 'painting' };

const output = replacePlaceholders_2(input_1, replacements);
console.log(output); // Output: "I want to do this."

console.log('------------------------------');


function transformString(inputString, replacements) {
    return inputString.replace(/\{\{(\w+)\}\}/g, function(match, key) {
      return replacements[key] || '';
    });
  }
  
  const inputString = '{{P1}} want to {{P2}} {{P3}}.';
  const replacements_1 = { P1: 'Sam', P2: 'go', P3: 'hiking' };
  
  const transformedString = transformString(inputString, replacements_1);
  console.log(transformedString);
  console.log('------------------------------');
