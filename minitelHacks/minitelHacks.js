// R: to connect to the minitel over serial

// setup serial
Serial4.setup(4800);

// receive data --> useful for debug
Serial4.on('data', function(data){
  print( data );
});

// receive data --> R: line feed is Ctrl+J on the minitel keyboard :)
/*
var command = "";
Serial4.on('data', function(data){
  command += data;
  if( command.indexOf("\n") ){command = ""; }
  else {
    print( command );
    // if command === 'someStuff', do stg ..
  }
});
*/

// wip char map
var charMap = {
  // special keys
  
  // mark keys
  '¬': ',',
  '¾': '>',
  '': '',
  '': '',
  '': '',
  '': '',
  '': '',
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
}

// logic:
var rxBuffer = "";
Serial4.on('data', function(data){
  if ( data !== '\n') {
    // replace char by one from map if it's registered & a replacement is provided
    if( charMap[data] ) data = charMap[data]; // override it using corresponding replacement without looping ;)
    // append to rx buffer
    rxBuffer += data;
  } else {
    // display the content of the rx buffer & reset it
    print( 'received: ' + rxBuffer );
    rxBuffer = "";
  }
});


// handle parity errors
Serial4.on('parity', function(){
  print( 'configured parity bit does not match the received bits one' );
});


// the following js is a try to convert the below Arduino code
// R: the B001111111 is Arduino specific !

function modifyParity(c){
  var byte = 1 << 6;
  var p = false; // boolean
  //var c &= B01111111; // clear out bits ( Arduino specific ? )
  var c = c & B01111111; // alternative syntax allowed in javascript ?
  while(i){
    if( c & i ){
     p = !p;
    }
    i >>= 1;
  }
  c |= p << 7;
  return c;
}

function sendMessage(msg){
  var i = 0;
  while(  msg[i] > 0 ){
    msg[i] = modifyParity( msg[i] );
    i++;
  }
  //Serial.write(msg);
  //Serial.flush();
  SerialWrite(msg);
}

// helper
function SerialWrite(buffer){
  var output = "";
  for (i=0; i < buffer.length; i++) {
    output +=buffer[i].charCodeAt(0).toString(2) + " ";
  }
  console.log( output );
}

/*
original Arduino code


 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the CC0 license (French version).
 * See http://vvlibri.org/fr/licence/cc0/10/fr/legalcode for more details.
*/
/*
void setup() {
    Serial.begin(4800);
    sendMessage("\r\t\t\t\t");
}

char modifyParity(byte c) {
    byte i = 1 << 6;
    boolean p = false;
    c &= B01111111;
    while(i) {
        if(c & i) {
            p = !p;
        }
        i >>= 1;
    }
    c |= p << 7;
    return c;
}

void sendMessage(char *msg) {
    int i = 0;
    while(msg[i] > 0) {
        msg[i] = modifyParity(msg[i]);
        i++;
    }
    Serial.write(msg);
    Serial.flush();
}

void loop() {
    sendMessage("\x1b[D\x1b[D\x1b[D\x1b[D\x1b[D####\n");
    sendMessage("\x1b[D\x1b[D\x1b[D\x1b[D\x1b[D#-AT-#\n");
    sendMessage("\x1b[D\x1b[D\x1b[D\x1b[D\x1b[D\x1b[D#-CG-#\n");
    sendMessage("\x1b[D\x1b[D\x1b[D\x1b[D\x1b[D\x1b[D\x1b[D#--TA--#\n");
    sendMessage("\x1b[D\x1b[D\x1b[D\x1b[D\x1b[D\x1b[D\x1b[D#-AT-#\n");
    sendMessage("\x1b[D\x1b[D\x1b[D\x1b[D\x1b[D\x1b[D#-GC-#\n");
}

*/
