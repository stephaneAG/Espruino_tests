###### Espruino AST & Cie

The code & stuff present here relates to the ability to send the Espruino code via audio without any PSK, ..
The test setup uses the Espruino on USB of a debugging laptop & the C11/serial4Rx pin to the tip of an audio jack ( TRRS )

( this may only happend for my setup - feel free to tell me about a novel way to solve this trouble ;p )
On my desktop computer, none of the Chrome Packaged Apps have the serial connection working ( since I messed around with Electron ..),
so no luck with trying the Audio Communication in the official Espruino Web IDE ..  
.. this being said, a tool I wrote that uses the Espruino's code for the "audio_serial_write" indeed works in sending data

Since the code for receiving audio is said to be highly coupled with the Espruino Web ID<e, I still have to digg that subject


What's yet to be tested:
- using a TRS cable to receive audio serial stuff from laptop
- using a TRS cable to receive audio serial stuff from tablet
- using a TRRS cable to receive audio serial stuff as well as send some from desktop computer
- using a TRRS cable to receive audio serial stuff as well as send some from laptop
- using a TRRS cable to receive audio serial stuff as well as send some from tablet

From the results of each of the above tests, a table 'll be written, describing the necessary audio setup adjustements

----

The wirings for the above setup are the following:
- [Audio Rx TRRS iMac->Espruino](https://123d.circuits.io/circuits/2161305-espruino-audio-rx-using-trrs-jack-for-imac-espruino)

----

AST 's code is available here [AudioSerialTest](https://github.com/stephaneAG/AST)

The code to use to send audio serial stuff is the following:  
( R: turn off the oscillator before doing so, as it'll send gibberish to the Espruino pin otherwise - nice pin check ;p )
```javascript
AST.audio_serial_write('digitalWrite(LED3, 1);\n', function(){ console.log('data written !'); })
```


The Espruino code is the following:
( see 'ASTevalCompanion.js' for way to prevent gibberish to be evaluated ;p )
```javascript
var dataBuff = '';
  Serial4.setup(9600); // aka: use default Serial4 Rx pin ( C11 on original Espruino board )
  Serial4.on('data', function(data){
    dataBuff += data;
    if ( dataBuff.indexOf('\n') !== -1 ){
      print('>' + dataBuff); // prints perfectly EVERYTHING ^^
      eval ( dataBuff ); // yup, "being [too] confident" ^^
      dataBuff = ''; // clear/reset data buff
    }
  });
```
