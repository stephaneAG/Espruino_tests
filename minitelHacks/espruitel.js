// connect to the minitel Tx & Rx
Serial4.setup(4800, {btyesize: 8, parity: 'odd'}); // parity needs ?

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
