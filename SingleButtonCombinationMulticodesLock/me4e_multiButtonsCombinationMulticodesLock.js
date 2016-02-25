/*
  multiButtonsCombinationMulticodesLock.js - allows to trigger stuff based on codes/patterns when buttonPresses/pinStateChanges happens
  based on http://www.espruino.com/Single+Button+Combination+Lock ( code & big thx to Gordon Williams - @Espruino )

  R: TO BE TESTED !! UNTESTED YET !!

  by @StephaneAG - 2016
*/

var lastPress = 0;        // /!\ needed on Espruino ( to debounce one button .. )
var pressCount = 0;       // number of presses
//var digit = 0;        // which digit of the code we're on -> R: old
var chunk = 0;        // which digit of the code we're on -> name better reflect that we may have a digit[+number] chunk
var btnBeingPressed = ''; // either x, y or z

var timeout;              // timeout that happens one second after button press
var shortestMatchTimeout; // timeout that happens one second and a half after a shortestCodeMatch is found
var inactivityTimeout;    // timeout that happens one second and a half after no input if the above is undefined

// R: old set of codes: take only a number of presses to represent a digit in account
/*
var codes = [ 
             [3, 1, 2],   // unlock 1: unlock Door
             [4, 1, 2],   // unlock 2: send SMS
             [4, 1, 2, 1], // unlock 3: send Desktop notification
             [4, 1, 2, 2], // unlock 4: push server notification
             [4, 1, 2, 3], // unlock 5: send Desktop notification
             [4, 1, 3], // unlock 6: unlock door unpolitely
             [4, 1, 4], // unlock 7: unlock door mario-style
             // ..
            ];
*/
            
// the buttons maps, to easily id<->pin
var btnsMaps = { 'x': 'B6', 'y': 'B7', 'z': 'B8' };
// the patterns, this time taking in account the button as well as the number of times it's being pressed
// Nb: remember to thnk about ['xy2', 'z3', ..] for next implm update :)
var codes = [ 
             ['x3', 'y1', 'z2'], // pattern 1: 
             ['x4', 'y1', 'z2'], // // pattern 2: 
             ['x4', 'y1', 'z2', 'x1'], // pattern 3: 
             ['x4', 'y1', 'z2', 'x2'], // pattern 4: 
             ['x4', 'y1', 'z2', 'x3'], // pattern 5: 
             ['x4', 'y1', 'z3'], // pattern 6: 
             ['x4', 'y1', 'z4'], // pattern 7:
             ['x', 'y2', 'z3'], // pattern 8:
             ['x', 'y', 'x', 'y'], // pattern 9:
             ['x2', 'y', 'x2', 'y'], // pattern 10:
             ['x2', 'y2'] // pattern 11:
             // .. // pattern <n°>: 
            ];
            
var remainingCodes = codes; // initially allow all patterns registered above

var delayBetweenPresses = 1000; // delay between button presses ( R: 500 is nice, 250 is neat ! )
var delayBeforeShortestCodeMatch = delayBetweenPresses/2 + delayBetweenPresses; // delay before shortest code match autoselect ( R: has to be bigger than the delay between presses ! )
var delayForInactivity = delayBeforeShortestCodeMatch; // delay before inactivity reset ( R: set to 0 to NOT use 'inactivity reset', ex: to play a validation after each digit entered .. scaling notes ? )
// Nb: when 'delayForInactivity' is setup as above, some precision is required for typing the code: one more half-second after a press 'd cancel them entirely ;p

// unlock/lock
function setLocked(isLocked){
  console.log( isLocked? 'locked' : 'unlocked' );
  setTimeout(function(){
    console.log('setLocked callback !');
  }, 2000);
}

// unlock/lock2
function setLocked2(isLocked){
  console.log( isLocked? 'locked' : 'unlocked' );
  setTimeout(function(){
    console.log('setLocked2 callback !');
  }, 2000);
}

// inactivity reset
function inactivityReset(){
  //console.log('inactivity reset ! - back to the start !'); // uncolored log
  console.log('%cinactivity reset ! - back to the start !', 'color: red;'); // uncolored log
  setLocked(true);
  // go to the beginning of code again
  digit = 0;
  remainingCodes = codes;
  // reset presses
  pressCount = 0;
}

// timeout
function onTimeout(){
  timeout = undefined;
  // check against our codeS
  var currentCodes = remainingCodes;
  //console.log('current codes:\n' + remainingCodes.join('\n') ); // uncolored log
  var coloredLog = "current codes:\n";
  var logColors = [];
  currentCodes.forEach(function(code){
    var codeLog = "%c[ ";
    logColors.push( 'color: grey;' );
    code.forEach(function(codeChunk){
      codeLog += "%c" + codeChunk + "%c ";
      logColors.push( 'color: blue;', 'color: grey;' );
    });
    codeLog += "%c]\n";
    logColors.push( 'color: grey;' );
    coloredLog += codeLog;
  });
  logColors.unshift( coloredLog );
  console.log.apply(console, logColors ); // colored log

  remainingCodes = [];
  currentCodes.forEach(function(code){
    //if(pressCount == code[digit]) remainingCodes.push(code); // R: old code, with chunk being only a digit
    // check if chunk contains a numeric additionally to an id
    if (code[chunk].length > 1 ){
      var btnId = code[chunk][0];
      var count = Number( code[chunk].substr(1) );
    } else {
      var btnId = code[chunk];
      var count = 1;
    }
    // now compare
    if(pressCount == code[chunk] && btnBeingPressed == btnId ) remainingCodes.push(code);
  });
  //console.log('remaining codes:\n' + remainingCodes.join('\n') ); // uncolored log
  var coloredLog = "remaining codes:\n";
  var logColors = [];
  remainingCodes.forEach(function(code){
    var codeLog = "%c[ ";
    logColors.push( 'color: grey;' );
    var codeChunkIdx = 0;
    code.forEach(function(codeChunk){
      codeLog += "%c" + codeChunk + "%c ";
      //logColors.push( codeChunkIdx > digit? 'color: blue;' : 'color: green;', 'color: grey;' ); // simple differentiation ( green = code chunks already matching, blue = code chunks to be matched against )
      if (code.length == digit+1) logColors.push( 'color: purple;', 'color: grey;' ); // shortest code match differentiation
      else logColors.push( codeChunkIdx > digit? 'color: blue;' : 'color: green;', 'color: grey;' ); // simple differentiation ( see above comment )
      codeChunkIdx++;
    });
    codeLog += "%c]\n";
    logColors.push( 'color: grey;' );
    coloredLog += codeLog;
  });
  logColors.unshift( coloredLog );
  console.log.apply(console, logColors ); // colored log

  
  if(remainingCodes.length != 0){ // multi codes
    //console.log('remaining codes not empty');
    //digit++;
    chunk++;
    
    var shortestCodeMatch = undefined;
    remainingCodes.forEach(function(code){
      if(digit >= code.length){
        shortestCodeMatch = code;
      }
    });

    if(shortestCodeMatch && remainingCodes.length == 1 ){
      if(inactivityTimeout) clearTimeout(inactivityTimeout); // cancel the 'inactivity reset' that may be pending
      //console.log('code match found !'); // uncolored log
      console.log('%ccode match found !', 'color: blue;'); // colored log
      //console.log('end of code [' + shortestCodeMatch.join(' ') + '] - triggering handler ..'); // uncolored log
      console.log('%cend of code %c[%c' + shortestCodeMatch.join(' ') + '%c]%c - triggering handler ..', 'color: green;', 'color: grey;',  'color: blue;', 'color: grey;', 'color: green;'); // colored log
      if( shortestCodeMatch.join() == codes[0].join() ) setLocked(false);
      else if( shortestCodeMatch.join() == codes[1].join() ) setLocked2(false);
      // ..
      // or, to replace the above for many patterns
      codes.forEach(function(code){
        if( code.join() == shortestCodeMatch.join() ) console.log('Code: ' + code.join() )// trigger the corresponding handler ..
      })
      // go to the beginning of code again
      //digit = 0;
      chunk = 0;
      remainingCodes = codes;
    } else if(shortestCodeMatch){
      if(inactivityTimeout) clearTimeout(inactivityTimeout); // cancel the 'inactivity reset' that may be pending
      //console.log('shortest code match found !'); // uncolored log
      console.log('%cshortest code match found !', 'color: purple;'); // colored log
      shortestMatchTimeout = setTimeout(function(){
        //console.log('end of code [' + shortestCodeMatch.join(' ') + '] - triggering handler ..'); // uncolored log
        console.log('%cend of code %c[%c' + shortestCodeMatch.join(' ') + '%c]%c - triggering handler ..', 'color: green;', 'color: grey;',  'color: purple;', 'color: grey;', 'color: green;'); // colored log
        if( shortestCodeMatch.join() == codes[0].join() ) setLocked(false);
        else if( shortestCodeMatch.join() == codes[1].join() ) setLocked2(false);
        // ..
        // or, to replace the above for many patterns
        codes.forEach(function(code){
          if( code.join() == shortestCodeMatch.join() ) console.log('Code: ' + code.join() )// trigger the corresponding handler ..
        })
        // go to the beginning of code again
        //digit = 0;
        chunk = 0;
        remainingCodes = codes;
      }, delayBeforeShortestCodeMatch);
    } else {
      //console.log('no shortestCodeMatch nor code match ..'); // uncolored log
      console.log('%cno shortestCodeMatch nor code match ..', 'color: orange;'); // colored log
      //console.log('.. but digit correct ! - next digit ..'); // uncolored log
      console.log('%c.. but digit correct ! - next digit ..', 'color: green;'); // colored log
    }
  } else {
    if(inactivityTimeout) clearTimeout(inactivityTimeout); // cancel the 'inactivity reset' that may be pending
    //console.log('remaining codes may be empty');
    //console.log('error ! - back to the start !'); // uncolored log
    console.log('%cerror ! - back to the start !', 'color: red;'); // colored log
    setLocked(true);
    // go to the beginning of code again
    //digit = 0;
    chunk = 0;
    remainingCodes = codes;
  }
  pressCount = 0;
}

// press
//function onPress(){ // R: old
function onPress(btnId){ // new, getting passed a buttonId
  btnBeingPressed = btnId; // update the btn being pressed

  pressCount++; // R: adapt to apply only if button being pressed hasn't changed since last press ?
  //if (btnId == btnBeingPressed) pressCount++;
  //else .. ? 
  console.log(pressCount);
  // if we had a timeout from another button press, remove it
  if(timeout) clearTimeout(timeout);
  // if we had a timeout from a shortestCodeMatch, remove it
  if(shortestMatchTimeout) clearTimeout(shortestMatchTimeout);
  // if we had a timeout from an inactivity reset, remove it
  if(inactivityTimeout) clearTimeout(inactivityTimeout);
  // one second ( or anything else set in 'delayBetweenPresses' ) after this press, run 'onTimeout()'
  timeout = setTimeout(onTimeout, delayBetweenPresses);
  // one second and a half ( or anything else set in 'delayForInactivity' ) after this press, run 'inactivityReset()'
  //inactivityTimeout = setTimeout(inactivityReset, delayForInactivity);
  if( delayForInactivity != 0 ) inactivityTimeout = setTimeout(inactivityReset, delayForInactivity);
}


/* -- browser usage -- */
// fake button using spacebar ( simulates the 'buttonWatcher()' function in Espruino )
/*
document.addEventListener('keyup', function(e){ 
  if(e.keyCode == 32){ // I only use the spacebar as fake button ( ' could have used the whole keyboard .. )
    //console.log('lol' + new Date().toString() );
    onPress(null); // R: 'timeDiff' not used
  } 
});
*/

// TODO: write new quick browser usage, using different keys on keyboard OR mouse clicks on specific stuff ( .. )
document.addEventListener('keyup', function(e){
  //console.log(e.keyCode)
  if(e.keyCode == 88) onPress('x'); // left papatte
  else if(e.keyCode == 89) onPress('y'); // right papatte
  else if(e.keyCode == 90) onPress('z'); // tummy
});

/* -- Espruino usage -- */
// watch button for presses ( or actually pin activity )
function buttonWatch(e){
  var timeDiff = e.time - lastPress;
  lastPress = e.time;
  if(timeDiff>0.1) onPress();
}
