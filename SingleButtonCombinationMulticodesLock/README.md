Single Button Combination Multicodes Lock
-----------------------------------------

Allows to trigger stuff based on codes/patterns when a buttonPress/pinStateChange happens

<img src="stephaneadamgarnier.com/SingleButtonCombinationMulticodesLock/espruino_SingleButtonCombinationLock_onSteroids_browserColoredLogs1.png" width="49%">
<img src="stephaneadamgarnier.com/SingleButtonCombinationMulticodesLock/espruino_SingleButtonCombinationLock_onSteroids_browserColoredLogs2.png" width="49%">
<img src="stephaneadamgarnier.com/SingleButtonCombinationMulticodesLock/espruino_SingleButtonCombinationLock_onSteroids_browserColoredLogs3.png" width="49%">
<img src="stephaneadamgarnier.com/SingleButtonCombinationMulticodesLock/espruino_SingleButtonCombinationLock_onSteroids_browserColoredLogs4.png" width="49%">
<img src="stephaneadamgarnier.com/SingleButtonCombinationMulticodesLock/espruino_SingleButtonCombinationLock_onSteroids_browserColoredLogs5.png" width="49%">  
nb: the images above reflects usage of the browser version, that provides output coloring

##### Supports multiple codes/paterns ( main addition to the original code )
```javascript
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
```

##### Provides shortest code match  & inactivity timeouts
'shortest code match' timeout happens when multiple patters/codes share the same beginning while one's length matches the keypresses digits.  
In this case, if no more presses are sensed after a delay, we trigger the handler of the length-matching code.  
  
/!\ the delay has to be greater than the 'delayBetweenPresses' delay if some codes/patterns share the same beginning
```javascript
var shortestMatchTimeout; // timeout that happens one second and a half after a shortestCodeMatch is found
// ( .. )
var delayBeforeShortestCodeMatch = delayBetweenPresses/2 + delayBetweenPresses; // delay before shortest code match autoselect ( R: has to be bigger than the delay between presses ! )
// ( .. )
var shortestCodeMatch = undefined;
remainingCodes.forEach(function(code){
  if(digit >= code.length){
    shortestCodeMatch = code;
  }
});
// ( .. )
shortestMatchTimeout = setTimeout(function(){
  // ( .. )
  if( shortestCodeMatch.join() == codes[0].join() ) setLocked(false);
  else if( shortestCodeMatch.join() == codes[1].join() ) setLocked2(false);
  // ..
  // go to the beginning of code again
  digit = 0;
  remainingCodes = codes;
}, delayBeforeShortestCodeMatch);
```

'inactivity reset' timeout happens when no activity is sensed for a the defined duration.
It simply resets the combination try back to the start, or in other words, acts as if an incorrect digit had been entered.  
It can be toggled off simply by specifying a delay of 0.  
  
/!\ the delay has to be greater or at least equal to the 'shortest code match' delay ( to NOT bypass it if some codes/patterns share the same beginning  )
```javascript
var inactivityTimeout;    // timeout that happens one second and a half after no input if the above is undefined
// ( .. )
var delayForInactivity = delayBeforeShortestCodeMatch; // delay before inactivity reset ( R: set to 0 to NOT use 'inactivity reset', ex: to play a validation after each digit entered .. scaling notes ? )
// Nb: when 'delayForInactivity' is setup as above, some precision is required for typing the code: one more half-second after a press 'd cancel them entirely ;p
// ( .. )
// inactivity reset
function inactivityReset(){
  // ( .. )
  setLocked(true);
  // go to the beginning of code again
  digit = 0;
  remainingCodes = codes;
  // reset presses
  pressCount = 0;
}
// ( .. )
if(inactivityTimeout) clearTimeout(inactivityTimeout); // cancel the 'inactivity reset' that may be pending
// ( .. )
if( delayForInactivity != 0 ) inactivityTimeout = setTimeout(inactivityReset, delayForInactivity);
```

##### Works on both Espruino, original & Pico, and browsers ( useful to debug stuff & have a colored output )
```javascript
/* -- browser usage -- */
// fake button using spacebar ( simulates the 'buttonWatcher()' function in Espruino )
document.addEventListener('keyup', function(e){ 
  if(e.keyCode == 32){ // I only use the spacebar as fake button ( ' could have used the whole keyboard .. )
    //console.log('lol' + new Date().toString() );
    onPress(null); // R: 'timeDiff' not used
  } 
});

/* -- Espruino usage -- */
// watch button for presses ( or actually pin activity )
function buttonWatch(e){
  var timeDiff = e.time - lastPress;
  lastPress = e.time;
  if(timeDiff>0.1) onPress();
}
```

based on [Single Button Combination Lock](http://www.espruino.com/Single+Button+Combination+Lock) ( code by & big thx to Gordon Williams - @Espruino )
