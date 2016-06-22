// connect to the minitel Tx & Rx
Serial4.setup(4800, {bytesize: 7, parity: 'odd'}); // parity needs ? being tested ..
//Serial4.setup(9600, {bytesize: 8, parity: 'null'}); // untested yet

// wip char map
// R: to add:
// - ²J  -> when hitting Ctrl+toBottomLeftArrow(ErasePage)
//
//
var charMap = {
  // shortcuts
  'Û?ú': 'modeSelect',
  // special keys
  'ÏP': 'summary',
  'ÏÑ': 'cancel',
  'ÏÒ': 'back',
  'ÏS': 'repeat',
  'Ïí': 'guide',
  'Ïl': 'correction',
  'Ïî': 'forward',
  'ÏM': 'send',
  // mark keys
  '¬': ',',
  '¾': '>',
  'À': '@',
  '»': ';',
  '½': '=',
  'ª': '*',
  '¯': '/',
  // arrow keys
  'ÛH':   'goTopLeft',
  'Û²Ê':  'eraseScreen',
  'ÛA ':  'upArrow',
  'ÛM':   'SuppressLine',
  'ÛB ':  'downArrow',
  'ÛÌ':   'insertLine',
  'ÛD ':  'leftArrow',
  'ÛP':   'suppressChar',
  'ÿ':    'delete',
  'ÛÃ ':  'rightArrow',
  'Û´l ': 'insertChar',
  // letter keys
  'á': 'a',
  'ú': 'z',
  'Å': 'E',
  'Ò': 'R',
  'Ô': 'T',
  'ù': 'y',
  'õ': 'u',
  'É': 'I',
  'Ï': 'O',
  'ð': 'p',
  'Ñ': 'Q',
  'ó': 's',
  'ä': 'd',
  'Æ': 'F',
  'ç': 'g',
  'è': 'h',
  'Ê': 'J',
  'ë': 'k',
  'Ì': 'L',
  'í': 'm',
  '×': 'W',
  'Ø': 'X',
  'Ã': 'C',
  'ö': 'v',
  'â': 'b',
  'î': 'n',
  // number keys
  '±': '1',
  '²': '2',
  '£': '#',
  '´': '4',
  '¥': '%',
  '¦': '&',
  '·': '7',
  '¸': '8',
  '©': ')',
  'ª': '*',
  'Û': '[',
  'Þ': 'littleUpArrow',
  'Ý': ']'
};

// logic:
var rxBuffer = "";
Serial4.on('data', function(data){
  if ( data !== '\n') {
    var glyph = data; // bckp for debug
    // replace char by one from map if it's registered & a replacement is provided
    if( charMap[data] ) data = charMap[data]; // override it using corresponding replacement without looping ;)
    // append to rx buffer
    rxBuffer += data;
    print( 'received glyph: ' + glyph + ' mapped to: ' + data);
  } else {
    // display the content of the rx buffer & reset it
    print( 'received buffer: ' + rxBuffer );
    eval( rxBuffer ); // "dangerous" ..
    rxBuffer = "";
  }
});


// handle parity errors
Serial4.on('parity', function(){
  print( 'configured parity bit does not match the received bits one' );
});


// build reverse charMap for Tx part ( occupies sapce, but avoiding many loops .. )
var revCharMap = {};
for( glyph in charMap) revCharMap[ charMap[glyph] ] = glyph;
// same as for( glyph in charMap) revCharMap[ String(charMap[glyph]) ] = glyph;

// quick helper fcn to parse by char, map & write
// usage: minitel('Hello Digital World !')
//        data to be sent:Hello Diçitál ×orlä !
function minitelPrint(data){
  var chunks = data.split(''); // split
  for(var i=0; i<chunks.length; i++){ // parse
    if( revCharMap[chunks[i]] ) chunks[i] = revCharMap[chunks[i]]; // override without looping ;)
  }
  data = chunks.join(''); // concat
  //Serial4.write(data); // send
  console.log('data to be sent:' + dataa);// fake send ;P
}

// quick helper fcn to parse by elem, map & write
// usage: minitelSend(['goTopLeft', 'eraseScreen'])
//        data to be sent:ÛHÛ²Ê
function minitelSend(elems){
  for(var i=0; i<elems.length; i++){
    if( revCharMap[elems[i]] ) elems[i] = revCharMap[elems[i]]; // override without looping ;)
  }
  var data = elems.join(''); // concat
  //Serial4.write(data); // send
  // or 
  //Serial4.write(elems); // send
  console.log('data to be sent:' + data);// fake send ;P
}

// quick helper fcn to write directly
// usage:
//
function minitelWrite(data){
  //Serial4.write(data); // send
  console.log('data to be sent:' + data);// fake send ;P
}
