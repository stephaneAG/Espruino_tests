Single Button Combination Multicodes Lock
-----------------------------------------

Allows to trigger stuff based on codes/patterns when a buttonPress/pinStateChange happens.  
See the [screenshots](#output-coloring-when-using-the-browser-version--up-arrow_up) for a local preview of the usage  

based on [Single Button Combination Lock](http://www.espruino.com/Single+Button+Combination+Lock) ( code by & big thx to Gordon Williams - @Espruino )

To copy to the Espruino Web IDE -->
<a href="http://www.espruino.com/webide?code=%2F*%0A%20%20SingleButtonCombinationMulticodesLock.js%20-%20allows%20to%20trigger%20stuff%20based%20on%20codes%2Fpatterns%20when%20a%20buttonPress%2FpinStateChange%20happens%0A%20%20based%20on%20http%3A%2F%2Fwww.espruino.com%2FSingle%2BButton%2BCombination%2BLock%20(%20code%20%26%20big%20thx%20to%20Gordon%20Williams%20-%20%40Espruino%20)%0A%0A%20%20by%20%40StephaneAG%20-%202015%0A*%2F%0A%0Avar%20lastPress%20%3D%200%3B%20%20%20%20%20%20%20%20%2F%2F%20%2F!%5C%20needed%20on%20Espruino%0Avar%20pressCount%20%3D%200%3B%20%20%20%20%20%20%20%2F%2F%20number%20of%20presses%0Avar%20timeout%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20timeout%20that%20happens%20one%20second%20after%20button%20press%0A%0Avar%20shortestMatchTimeout%3B%20%2F%2F%20timeout%20that%20happens%20one%20second%20and%20a%20half%20after%20a%20shortestCodeMatch%20is%20found%0Avar%20inactivityTimeout%3B%20%20%20%20%2F%2F%20timeout%20that%20happens%20one%20second%20and%20a%20half%20after%20no%20input%20if%20the%20above%20is%20undefined%0A%0Avar%20codes%20%3D%20%5B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%5B3%2C%201%2C%202%5D%2C%20%20%20%2F%2F%20unlock%201%3A%20unlock%20Door%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%5B4%2C%201%2C%202%5D%2C%20%20%20%2F%2F%20unlock%202%3A%20send%20SMS%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%5B4%2C%201%2C%202%2C%201%5D%2C%20%2F%2F%20unlock%203%3A%20send%20Desktop%20notification%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%5B4%2C%201%2C%202%2C%202%5D%2C%20%2F%2F%20unlock%204%3A%20push%20server%20notification%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%5B4%2C%201%2C%202%2C%203%5D%2C%20%2F%2F%20unlock%205%3A%20send%20Desktop%20notification%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%5B4%2C%201%2C%203%5D%2C%20%2F%2F%20unlock%206%3A%20unlock%20door%20unpolitely%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%5B4%2C%201%2C%204%5D%2C%20%2F%2F%20unlock%207%3A%20unlock%20door%20mario-style%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20..%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%3B%0Avar%20remainingCodes%20%3D%20codes%3B%0Avar%20digit%20%3D%200%3B%20%20%20%20%20%20%20%20%2F%2F%20which%20digit%20of%20the%20code%20we%27re%20on%0A%0Avar%20delayBetweenPresses%20%3D%201000%3B%20%2F%2F%20delay%20between%20button%20presses%20(%20R%3A%20500%20is%20nice%2C%20250%20is%20neat%20!%20)%0Avar%20delayBeforeShortestCodeMatch%20%3D%20delayBetweenPresses%2F2%20%2B%20delayBetweenPresses%3B%20%2F%2F%20delay%20before%20shortest%20code%20match%20autoselect%20(%20R%3A%20has%20to%20be%20bigger%20than%20the%20delay%20between%20presses%20!%20)%0Avar%20delayForInactivity%20%3D%20delayBeforeShortestCodeMatch%3B%20%2F%2F%20delay%20before%20inactivity%20reset%20(%20R%3A%20set%20to%200%20to%20NOT%20use%20%27inactivity%20reset%27%2C%20ex%3A%20to%20play%20a%20validation%20after%20each%20digit%20entered%20..%20scaling%20notes%20%3F%20)%0A%2F%2F%20Nb%3A%20when%20%27delayForInactivity%27%20is%20setup%20as%20above%2C%20some%20precision%20is%20required%20for%20typing%20the%20code%3A%20one%20more%20half-second%20after%20a%20press%20%27d%20cancel%20them%20entirely%20%3Bp%0A%0A%2F%2F%20unlock%2Flock%0Afunction%20setLocked(isLocked)%7B%0A%20%20console.log(%20isLocked%3F%20%27locked%27%20%3A%20%27unlocked%27%20)%3B%0A%20%20setTimeout(function()%7B%0A%20%20%20%20console.log(%27setLocked%20callback%20!%27)%3B%0A%20%20%7D%2C%202000)%3B%0A%7D%0A%0A%2F%2F%20unlock%2Flock2%0Afunction%20setLocked2(isLocked)%7B%0A%20%20console.log(%20isLocked%3F%20%27locked%27%20%3A%20%27unlocked%27%20)%3B%0A%20%20setTimeout(function()%7B%0A%20%20%20%20console.log(%27setLocked2%20callback%20!%27)%3B%0A%20%20%7D%2C%202000)%3B%0A%7D%0A%0A%2F%2F%20inactivity%20reset%0Afunction%20inactivityReset()%7B%0A%20%20inactivityTimeout%20%3D%20undefined%3B%20%2F%2F%20what%20fixes%20it%20%3F%0A%20%20console.log(%27inactivity%20reset%20!%20-%20back%20to%20the%20start%20!%27)%3B%20%2F%2F%20uncolored%20log%0A%20%20setLocked(true)%3B%0A%20%20%2F%2F%20go%20to%20the%20beginning%20of%20code%20again%0A%20%20digit%20%3D%200%3B%0A%20%20remainingCodes%20%3D%20codes%3B%0A%20%20%2F%2F%20reset%20presses%0A%20%20pressCount%20%3D%200%3B%0A%7D%0A%0A%2F%2F%20timeout%0Afunction%20onTimeout()%7B%0A%20%20timeout%20%3D%20undefined%3B%0A%20%20%2F%2F%20check%20against%20our%20codeS%0A%20%20var%20currentCodes%20%3D%20remainingCodes%3B%0A%20%20console.log(%27current%20codes%3A%5Cn%27%20%2B%20remainingCodes.join(%27%5Cn%27)%20)%3B%20%2F%2F%20uncolored%20log%0A%0A%20%20remainingCodes%20%3D%20%5B%5D%3B%0A%20%20currentCodes.forEach(function(code)%7B%0A%20%20%20%20if(pressCount%20%3D%3D%20code%5Bdigit%5D)%20remainingCodes.push(code)%3B%0A%20%20%7D)%3B%0A%20%20console.log(%27remaining%20codes%3A%5Cn%27%20%2B%20remainingCodes.join(%27%5Cn%27)%20)%3B%20%2F%2F%20uncolored%20log%0A%20%20%0A%20%20if(remainingCodes.length%20!%3D%3D%200)%7B%20%2F%2F%20multi%20codes%0A%20%20%20%20%2F%2Fconsole.log(%27remaining%20codes%20not%20empty%27)%3B%0A%20%20%20%20digit%2B%2B%3B%0A%20%20%20%20%0A%20%20%20%20var%20shortestCodeMatch%3B%20%2F%2F%20%3D%20undefined%3B%0A%20%20%20%20remainingCodes.forEach(function(code)%7B%0A%20%20%20%20%20%20if(digit%20%3E%3D%20code.length)%7B%0A%20%20%20%20%20%20%20%20shortestCodeMatch%20%3D%20code%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D)%3B%0A%0A%20%20%20%20if(shortestCodeMatch%20%26%26%20remainingCodes.length%20%3D%3D%201%20)%7B%0A%20%20%20%20%20%20if(inactivityTimeout)%7B%20clearTimeout(inactivityTimeout)%3B%20inactivityTimeout%20%3D%20undefined%3B%20%7D%20%2F%2F%20cancel%20the%20%27inactivity%20reset%27%20that%20may%20be%20pending%0A%20%20%20%20%20%20console.log(%27code%20match%20found%20!%27)%3B%20%2F%2F%20uncolored%20log%0A%20%20%20%20%20%20console.log(%27end%20of%20code%20%5B%27%20%2B%20shortestCodeMatch.join(%27%20%27)%20%2B%20%27%5D%20-%20triggering%20handler%20..%27)%3B%20%2F%2F%20uncolored%20log%0A%20%20%20%20%20%20if(%20shortestCodeMatch.join()%20%3D%3D%20codes%5B0%5D.join()%20)%20setLocked(false)%3B%0A%20%20%20%20%20%20else%20if(%20shortestCodeMatch.join()%20%3D%3D%20codes%5B1%5D.join()%20)%20setLocked2(false)%3B%0A%20%20%20%20%20%20%2F%2F%20..%0A%20%20%20%20%20%20%2F%2F%20go%20to%20the%20beginning%20of%20code%20again%0A%20%20%20%20%20%20digit%20%3D%200%3B%0A%20%20%20%20%20%20remainingCodes%20%3D%20codes%3B%0A%20%20%20%20%7D%20else%20if(shortestCodeMatch)%7B%0A%20%20%20%20%20%20if(inactivityTimeout)%7B%20clearTimeout(inactivityTimeout)%3B%20inactivityTimeout%20%3D%20undefined%3B%20%7D%20%2F%2F%20cancel%20the%20%27inactivity%20reset%27%20that%20may%20be%20pending%0A%20%20%20%20%20%20console.log(%27shortest%20code%20match%20found%20!%27)%3B%20%2F%2F%20uncolored%20log%0A%20%20%20%20%20%20shortestMatchTimeout%20%3D%20setTimeout(function()%7B%0A%20%20%20%20%20%20%20%20shortestMatchTimeout%20%3D%20undefined%3B%0A%20%20%20%20%20%20%20%20console.log(%27end%20of%20code%20%5B%27%20%2B%20shortestCodeMatch.join(%27%20%27)%20%2B%20%27%5D%20-%20triggering%20handler%20..%27)%3B%20%2F%2F%20uncolored%20log%0A%20%20%20%20%20%20%20%20if(%20shortestCodeMatch.join()%20%3D%3D%20codes%5B0%5D.join()%20)%20setLocked(false)%3B%0A%20%20%20%20%20%20%20%20else%20if(%20shortestCodeMatch.join()%20%3D%3D%20codes%5B1%5D.join()%20)%20setLocked2(false)%3B%0A%20%20%20%20%20%20%20%20%2F%2F%20..%0A%20%20%20%20%20%20%20%20%2F%2F%20go%20to%20the%20beginning%20of%20code%20again%0A%20%20%20%20%20%20%20%20digit%20%3D%200%3B%0A%20%20%20%20%20%20%20%20remainingCodes%20%3D%20codes%3B%0A%20%20%20%20%20%20%7D%2C%20delayBeforeShortestCodeMatch)%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20console.log(%27no%20shortestCodeMatch%20nor%20code%20match%20..%27)%3B%20%2F%2F%20uncolored%20log%0A%20%20%20%20%20%20console.log(%27..%20but%20digit%20correct%20!%20-%20next%20digit%20..%27)%3B%20%2F%2F%20uncolored%20log%0A%20%20%20%20%7D%0A%20%20%7D%20else%20%7B%0A%20%20%20%20if(inactivityTimeout)%7B%20clearTimeout(inactivityTimeout)%3B%20inactivityTimeout%20%3D%20undefined%3B%20%7D%20%2F%2F%20cancel%20the%20%27inactivity%20reset%27%20that%20may%20be%20pending%0A%20%20%20%20%2F%2Fconsole.log(%27remaining%20codes%20may%20be%20empty%27)%3B%0A%20%20%20%20console.log(%27error%20!%20-%20back%20to%20the%20start%20!%27)%3B%20%2F%2F%20uncolored%20log%0A%20%20%20%20setLocked(true)%3B%0A%20%20%20%20%2F%2F%20go%20to%20the%20beginning%20of%20code%20again%0A%20%20%20%20digit%20%3D%200%3B%0A%20%20%20%20remainingCodes%20%3D%20codes%3B%0A%20%20%7D%0A%20%20pressCount%20%3D%200%3B%0A%7D%0A%0A%2F%2F%20press%0Afunction%20onPress()%7B%0A%20%20pressCount%2B%2B%3B%0A%20%20console.log(pressCount)%3B%0A%20%20%2F%2F%20if%20we%20had%20a%20timeout%20from%20another%20button%20press%2C%20remove%20it%0A%20%20if(timeout)%20clearTimeout(timeout)%3B%0A%20%20%2F%2F%20if%20we%20had%20a%20timeout%20from%20a%20shortestCodeMatch%2C%20remove%20it%0A%20%20if(shortestMatchTimeout)%7B%20clearTimeout(shortestMatchTimeout)%3B%20shortestMatchTimeout%20%3D%20undefined%3B%20%7D%0A%20%20%2F%2F%20if%20we%20had%20a%20timeout%20from%20an%20inactivity%20reset%2C%20remove%20it%0A%20%20if(inactivityTimeout)%7B%20clearTimeout(inactivityTimeout)%3B%20inactivityTimeout%20%3D%20undefined%3B%20%7D%0A%20%20%2F%2F%20one%20second%20(%20or%20anything%20else%20set%20in%20%27delayBetweenPresses%27%20)%20after%20this%20press%2C%20run%20%27onTimeout()%27%0A%20%20timeout%20%3D%20setTimeout(onTimeout%2C%20delayBetweenPresses)%3B%0A%20%20%2F%2F%20one%20second%20and%20a%20half%20(%20or%20anything%20else%20set%20in%20%27delayForInactivity%27%20)%20after%20this%20press%2C%20run%20%27inactivityReset()%27%0A%20%20%2F%2FinactivityTimeout%20%3D%20setTimeout(inactivityReset%2C%20delayForInactivity)%3B%0A%20%20if(%20delayForInactivity%20!%3D%3D%200%20)%20inactivityTimeout%20%3D%20setTimeout(inactivityReset%2C%20delayForInactivity)%3B%0A%7D%0A%0A%0A%2F*%20--%20Espruino%20usage%20--%20*%2F%0A%2F%2F%20watch%20button%20for%20presses%20(%20or%20actually%20pin%20activity%20)%0Afunction%20buttonWatch(e)%7B%0A%20%20var%20timeDiff%20%3D%20e.time%20-%20lastPress%3B%0A%20%20lastPress%20%3D%20e.time%3B%0A%20%20if(timeDiff%3E0.1)%20onPress()%3B%0A%7D%0AsetWatch(buttonWatch%2C%20B6%2C%20%7Bedge%3A%22falling%22%2C%20repeat%3Atrue%7D)%3B%0A" class="codelink" title="Send to Web IDE"> <img src="http://www.espruino.com/favicon.ico"></a>


##### TODOs [:arrow_down:](#supports-multiple-codespatterns--main-addition-to-the-original-code--up-arrow_up-arrow_down) 
- [x] ~~multiple codes/patterns support~~
- [x] ~~togglable inactivity reset~~
- [ ] add 'MaxFailedTries' & 'MaxFailedTriesDelay' vars to delay any further input for some amount of time if <n> failed tries occured successively.  
Nb: 'failed tries' meaning 'wrong digit entered', NOT 'inactivity' ;)
- [ ] write an actual module from the current code ?
  

##### Supports multiple codes/patterns ( main addition to the original code ) [:up:](#single-button-combination-multicodes-lock) [:arrow_up:](#todos-arrow_down) [:arrow_down:](#provides-shortest-code-match---inactivity-timeouts-up--arrow_up-arrow_down) 
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

##### Provides shortest code match  & inactivity timeouts [:up:](#single-button-combination-multicodes-lock)  [:arrow_up:](#supports-multiple-codespatterns--main-addition-to-the-original-code--up-arrow_up-arrow_down) [:arrow_down:](#works-on-both-espruino--browsers--useful-to-debug-stuff--have-a-colored-output---up-arrow_up-arrow_down) 
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

##### Works on both Espruino & browsers ( useful to debug stuff & have a colored output )  [:up:](#single-button-combination-multicodes-lock) [:arrow_up:](#provides-shortest-code-match---inactivity-timeouts-up--arrow_up-arrow_down) [:arrow_down:](#output-coloring-when-using-the-browser-version--up-arrow_up) 
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
  
##### Output coloring when using the browser version  [:up:](#single-button-combination-multicodes-lock) [:arrow_up:](#works-on-both-espruino--browsers--useful-to-debug-stuff--have-a-colored-output---up-arrow_up-arrow_down)
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

[:up:](#single-button-combination-multicodes-lock)
