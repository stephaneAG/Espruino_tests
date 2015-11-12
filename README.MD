R: to produce a link to the Espruino Web Ide, just use the following javascript on any page containing some code
```javascript
var theCode = document.getElementById("fuck").innerHTML;
var espruinoLink2 = 'http://www.espruino.com/webide?code=' + theCode
           .replace('/ /g', '%20')      // escape spaces
           .replace('/\n/g', '%0A')     // <-- Escape linefeed
           .replace(/&/g, '%26')     // <-- Escape &
           .replace(/</g, '%3C')     // <-- Escape <
           .replace(/>/g, '%3E')     // <-- Escape >
           .replace(/#/g, '%23')     // <-- Escape #
           .replace(/"/g, '%22')     // <-- Escape "
           .replace(/'/g, '%27');    // <-- Escape '
window.location = espruinoLink2; // copy code to web ide right pane
```

ex: with [SingleButtonCombinationMulticodesLock_Espruino.js](https://raw.githubusercontent.com/stephaneAG/Espruino_tests/master/SingleButtonCombinationMulticodesLock/SingleButtonCombinationMulticodesLock_Espruino.js),
 we can produce the following link -->
<a href="http://www.espruino.com/webide?code=1%2B2%0A" class="codelink" title="Send to Web IDE"> <img src="http://www.espruino.com/favicon.ico"></a>

