/*
  The following code is a quick test on how to implement fading colors with an RGB LED
  
  Setup:
  2 x 220 Ohm resistors ( Green & Blue channels)
  1 x 1k resistor ( Red channel )
  Espruino B9 --/\/\/-- R
  Espruino B4 --/\/\/-- G
  Espruino B8 --/\/\/-- B
  Espruino B9 --------- Common cathode Gnd
  
  /!\ R: verify that your RGB LED is either common anode or common cathode
         the first 'd be connected to +V, while the later 'd be to Gnd
  
  StephaneAG - 2016
*/

var redPin = B9;
var bluePin = B8;
var greenPin = B4;
var rgbLED = {red: 0, green: 0, blue: 0 };
var colorTweenTimeout = undefined;

// desired logic
function blueToViolet(){
  tweenColor(redPin, 'red', 0, 1, 0, violetToRed);
}
function violetToRed(){
  tweenColor(bluePin, 'blue', 1, 0, 1, redToYellow);
}
function redToYellow(){
  tweenColor(greenPin, 'green', 0, 1, 0, yellowToGreen);
}
function yellowToGreen(){
  tweenColor(redPin, 'red', 1, 0, 1, greenToAqua);
}
function greenToAqua(){
  tweenColor(bluePin, 'blue', 0, 1, 0, aquaToBlue);
}
function aquaToBlue(){
  tweenColor(greenPin, 'green', 1, 0, 1, blueToViolet);
}

// helper(s)
function tweenColor(pin, channel, from, to, dir, callback){
  if( from < to && dir === 0 ){
    from+= 0.05;
    rgbLED[channel] = Number(from.toFixed(3));
    analogWrite(pin, rgbLED[channel]); // Espruino call
    colorTweenTimeout = setTimeout(function(){ tweenColor(pin, channel, from, to, dir, callback) }, 100);
  }
  else if( from > to && dir === 1 ){
    from-= 0.05;
    rgbLED[channel] = Number(from.toFixed(3));
    analogWrite(pin, rgbLED[channel]); // Espruino call
    colorTweenTimeout = setTimeout(function(){ tweenColor(pin, channel, from, to, dir, callback) }, 100);
  }
  else { callback(); }
}

function stopColorFade(){
  clearTimeout( colorTweenTimeout );
  analogWrite(redPin, 0);
  analogWrite(greenPin, 0);
  analogWrite(bluePin, 0);
}

// specific fcnality "smoothed" color feedback ;p ( circular stepping between states )
function deviceConnected_colorFeedback(){
  tweenColor(bluePin, 'blue', 0, 1, 0, function(){
    console.log('Device connected color feedback done !');
  });
}

function deviceCharging_colorFeedback(){
  tweenColor(bluePin, 'blue', 0, 1, 0, function(){
    tweenColor(greenPin, 'green', 1, 0, 1, function(){
      tweenColor(redPin, 'red', 0, 1, 0, function(){
        tweenColor(bluePin, 'blue', 1, 0, 1, function(){
          console.log('Device charging color feedback done !');
        })
      })
    })
  });
}

function deviceCharged_colorFeedback(){
  tweenColor(greenPin, 'green', 0, 1, 0, function(){
    tweenColor(redPin, 'red', 1, 0, 1, function(){
      console.log('Device charged color feedback done !');
    })
  });
}

function deviceDisconnected_colorFeedback(){
  tweenColor(redPin, 'red', 1, 0, 1, function(){
    console.log('Device disconnected color feedback done !');
  });
}


// run looping color fade
blueToViolet();
// to cancel ( ex: on disconnecting device )
clearTimeout( colorTweenTimeout );
