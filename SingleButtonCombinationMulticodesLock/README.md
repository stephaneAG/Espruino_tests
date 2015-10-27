Single Button Combination Multicodes Lock
-----------------------------------------

Allows to trigger stuff based on codes/patterns when a buttonPress/pinStateChange happens.  
See the [screenshots](https://github.com/stephaneAG/Espruino_tests/tree/master/SingleButtonCombinationMulticodesLock#output-coloring-when-using-the-browser-version) for a preview of the usage  
See the [screenshots](#output-coloring-when-using-the-browser-version) for a local preview of the usage  

##### TODOs:
- [x] multiple codes/patterns support
- [x] togglable inactivity reset
- [ ] add 'MaxFailedTries' & 'MaxFailedTriesDelay' vars to delay any further input for some amount of time if <n> failed tries occured successively.  
Nb: 'failed tries' meaning 'wrong digit entered', NOT 'inactivity' ;)
- [ ] write an actual module from the current code ?
  

##### Supports multiple codes/patterns ( main addition to the original code )
```javascript
var codes = [ 
             [3, 1, 2],    // unlock 1: unlock Door ( with random sound )
             [4, 1, 2],    // unlock 2: send SMS
             [4, 1, 2, 1], // unlock 3: send Desktop notification
             [4, 1, 2, 2], // unlock 4: push server notification
             [4, 1, 2, 3], // unlock 5: query the intercom for its current setup params/states ( .. )
             [4, 1, 3],    // unlock 6: unlock door unpolitely
             [4, 1, 4],    // unlock 7: unlock door mario-style
             [5, 1, 1],    // play "Tequila" loudly on the ground floor through the intercom speakers ;P
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
If the 'inactivity reset' is desactivated, we just wait for other digit(s) to be pressed ( if no code already matches the digits entered & their number ), to finally either grant a success & trigger corresponding handler on correct digit(s) or issue an error reset if one digit doesn't match  

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
  
##### Output coloring when using the browser version
While the code can be used on the Espruino, it'll run as well in any browser, and can provides us colored output to help testing & debugging aspecific configuration's parameters.  
Keep in mind that if you're using it on an Espruino, you'll have to remove or comment-out the colored logs calls [, & remmember that each call to 'console.log()' 'll consume a little CPU ? don't know yet how are treated calls when USB Rx/tx are not connected .. but this 'd occupy space anyway ]  

| shortest code match | code match |
|------------|------------|
|<img src="http://stephaneadamgarnier.com/SingleButtonCombinationMulticodesLock/espruino_SingleButtonCombinationLock_onSteroids_browserColoredLogs1.png">|<img src="http://stephaneadamgarnier.com/SingleButtonCombinationMulticodesLock/espruino_SingleButtonCombinationLock_onSteroids_browserColoredLogs2.png">|  

| digit error reset | inactivity reset |
|------------|------------|
|<img src="http://stephaneadamgarnier.com/SingleButtonCombinationMulticodesLock/espruino_SingleButtonCombinationLock_onSteroids_browserColoredLogs3.png">|<img src="http://stephaneadamgarnier.com/SingleButtonCombinationMulticodesLock/espruino_SingleButtonCombinationLock_onSteroids_browserColoredLogs4.png">|  
  
| inactivity reset off |
|------------|
|<img src="http://stephaneadamgarnier.com/SingleButtonCombinationMulticodesLock/espruino_SingleButtonCombinationLock_onSteroids_browserColoredLogs5.png">|  


based on [Single Button Combination Lock](http://www.espruino.com/Single+Button+Combination+Lock) ( code by & big thx to Gordon Williams - @Espruino )
