/*
  SingleButtonCombinationMulticodesLock.js - allows to trigger stuff based on codes/patterns when a buttonPress/pinStateChange happens
  based on http://www.espruino.com/Single+Button+Combination+Lock ( code & big thx to Gordon Williams - @Espruino )

  by @StephaneAG - 2015
*/

var lastPress = 0;        // /!\ needed on Espruino
var pressCount = 0;       // number of presses
var timeout;              // timeout that happens one second after button press

var shortestMatchTimeout; // timeout that happens one second and a half after a shortestCodeMatch is found
var inactivityTimeout;    // timeout that happens one second and a half after no input if the above is undefined

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
var remainingCodes = codes;
var digit = 0;        // which digit of the code we're on

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
  console.log('current codes:\n' + remainingCodes.join('\n') ); // uncolored log

  remainingCodes = [];
  currentCodes.forEach(function(code){
    if(pressCount == code[digit]) remainingCodes.push(code);
  });
  console.log('remaining codes:\n' + remainingCodes.join('\n') ); // uncolored log
  
  if(remainingCodes.length != 0){ // multi codes
    //console.log('remaining codes not empty');
    digit++;
    
    var shortestCodeMatch = undefined;
    remainingCodes.forEach(function(code){
      if(digit >= code.length){
        shortestCodeMatch = code;
      }
    });

    if(shortestCodeMatch && remainingCodes.length == 1 ){
      if(inactivityTimeout){ clearTimeout(inactivityTimeout); inactivityTimeout = undefined; } // cancel the 'inactivity reset' that may be pending
      console.log('code match found !'); // uncolored log
      console.log('end of code [' + shortestCodeMatch.join(' ') + '] - triggering handler ..'); // uncolored log
      if( shortestCodeMatch.join() == codes[0].join() ) setLocked(false);
      else if( shortestCodeMatch.join() == codes[1].join() ) setLocked2(false);
      // ..
      // go to the beginning of code again
      digit = 0;
      remainingCodes = codes;
    } else if(shortestCodeMatch){
      if(inactivityTimeout){ clearTimeout(inactivityTimeout); inactivityTimeout = undefined; } // cancel the 'inactivity reset' that may be pending
      console.log('shortest code match found !'); // uncolored log
      shortestMatchTimeout = setTimeout(function(){
        console.log('end of code [' + shortestCodeMatch.join(' ') + '] - triggering handler ..'); // uncolored log
        if( shortestCodeMatch.join() == codes[0].join() ) setLocked(false);
        else if( shortestCodeMatch.join() == codes[1].join() ) setLocked2(false);
        // ..
        // go to the beginning of code again
        digit = 0;
        remainingCodes = codes;
      }, delayBeforeShortestCodeMatch);
    } else {
      console.log('no shortestCodeMatch nor code match ..'); // uncolored log
      console.log('.. but digit correct ! - next digit ..'); // uncolored log
    }
  } else {
    if(inactivityTimeout){ clearTimeout(inactivityTimeout); inactivityTimeout = undefined; } // cancel the 'inactivity reset' that may be pending
    //console.log('remaining codes may be empty');
    console.log('error ! - back to the start !'); // uncolored log
    setLocked(true);
    // go to the beginning of code again
    digit = 0;
    remainingCodes = codes;
  }
  pressCount = 0;
}

// press
function onPress(){
  pressCount++;
  console.log(pressCount);
  // if we had a timeout from another button press, remove it
  if(timeout) clearTimeout(timeout);
  // if we had a timeout from a shortestCodeMatch, remove it
  if(shortestMatchTimeout){ clearTimeout(shortestMatchTimeout); shortestMatchTimeout = undefined; }
  // if we had a timeout from an inactivity reset, remove it
  if(inactivityTimeout){ clearTimeout(inactivityTimeout); inactivityTimeout = undefined; }
  // one second ( or anything else set in 'delayBetweenPresses' ) after this press, run 'onTimeout()'
  timeout = setTimeout(onTimeout, delayBetweenPresses);
  // one second and a half ( or anything else set in 'delayForInactivity' ) after this press, run 'inactivityReset()'
  //inactivityTimeout = setTimeout(inactivityReset, delayForInactivity);
  if( delayForInactivity != 0 ) inactivityTimeout = setTimeout(inactivityReset, delayForInactivity);
}


/* -- Espruino usage -- */
// watch button for presses ( or actually pin activity )
function buttonWatch(e){
  var timeDiff = e.time - lastPress;
  lastPress = e.time;
  if(timeDiff>0.1) onPress();
}
setWatch(buttonWatcher, BTN, {edge:"falling", repeat:true});
