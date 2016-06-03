/* personal requirements for the LCD connection */

// r,g,b
var lcdR = B4, lcdG = B3, lcdB = B2;

// contrast
var lcdContrast = B5;

//                                   rs,en,d4,d5,d6,d7
var lcd = require("HD44780").connect(A0,A1,C0,C1,C2,C3);


// microphone
var mike = C5;

// set contrast to maximum
digitalWrite(lcdContrast, 0);

// set all the RGB channels to the maximum
digitalWrite(lcdR, 0);
digitalWrite(lcdG, 0);
digitalWrite(lcdB, 0);

// to quickly test the backlight RGB fade - reusing the dummy RGB test code
var redPin = lcdR;
var bluePin = lcdB;
var greenPin = lcdG;
var rgbLED = {red: 0, green: 0, blue: 0 };
var colorTweenTimeout = undefined;


// ----- code from grb test stuff ----
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
    colorTweenTimeout = setTimeout(function(){ tweenColor(pin, channel, from, to, dir, callback); }, 100);
  }
  else if( from > to && dir === 1 ){
    from-= 0.05;
    rgbLED[channel] = Number(from.toFixed(3));
    analogWrite(pin, rgbLED[channel]); // Espruino call
    colorTweenTimeout = setTimeout(function(){ tweenColor(pin, channel, from, to, dir, callback); }, 100);
  }
  else { callback(); }
}

function stopColorFade(){
  clearTimeout( colorTweenTimeout );
  analogWrite(redPin, 0);
  analogWrite(greenPin, 0);
  analogWrite(bluePin, 0);
}

// ----------------------------------


// print hello world
lcd.print("Hello World!");

// lcd update/ clear 
var lcdUpdateCntr = 0;


// listen to mike & output bar graph
var w = new Waveform(128,{doubleBuffer:true});
w.on("buffer", function(buf) { 
  var l = buf.length;
  var v = E.variance(buf,E.sum(buf)/l)/l;
  console.log("------------------------------------------------------------".substr(0,v));
  
  // map/adapt the result to the LCD width ( 16 chars )
  var lcdOutput = "----------------".substr(0,v);
  //lcd.clear();
  //lcd.print(lcdOutput);
  
  if ( lcdUpdateCntr < 1 ) {
    lcd.print(lcdOutput);
    lcdUpdateCntr++;
  } else if ( lcdUpdateCntr === 1 ) {
    lcdUpdateCntr++;
  }
  else if ( lcdUpdateCntr == 5 ) {
    lcdUpdateCntr = 0;
    lcd.clear();
  } else {
    lcdUpdateCntr++;
  }
  console.log('lcd update counter: ' + lcdUpdateCntr );
  console.log('variance: ' + v);
  
});
w.startInput(mike,2000,{repeat:true});



// tween the backlight color fading
// run looping color fade
blueToViolet();
// to cancel ( ex: on disconnecting device )
//clearTimeout( colorTweenTimeout );


// var lcd = ... from simple example above ...
/*
function showData() {
 lcd.clear();
 lcd.setCursor(0,0);
 lcd.print("Current data:");
 lcd.setCursor(4,1);
 lcd.print("D1 = "+analogRead(mike));
}
setInterval(showData, 1000);
*/
