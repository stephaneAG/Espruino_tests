// R: the current code is only controlled by the cli or the IDE's terminal
//    the goal is to later port it to an ESP8266 runnig a webserver offering a page with the IR controls
// Nb: for the controls, we could have, as well as the usual btns, a circular one used to handle "all at once"
//     the idea is to use the accelerometer vals + threshold range on btn press, & then use any orientation 
//     until btn release to translate some degree of orientation of the phone, mapped to the range available
//     in that direction on the tv support
//
// Thnk: check the mem btns on the original remote to see what they would send
//       as a reminder, the btns other than up/down/left/right/ok don't send any signal ( yet they must do something .. )
//       depending on how stuf is handled, we may get unlimited mem positions & learn more codes :)
//
// R: press 'mem1' or 'mem2' for 5 seconds to save the orientation ( & maybe depth ? )
//    press '1' or '2' then 'ok' the restore orientation ( & depth ? ) to the one previously saved

// TODO: test with PWMs on other pins to see if it also works ( if we got this working first .. )
// R: the following pins seems to really need a ADC/DAC solution & not pwm ( didn't work on B8/B9 )
var irLed_anodePin = A0; // or A0 correct leg :)
var irLed_cathodePin = A1; // or A1 correct leg :)

// when we want to go some % of the full depth ( expansion from wall ) or specific 'swivel' degree ( 'on-the-fly swivel favs' ;p )
var fullDepthChange = 26000; // how long it takes for the tv support to go fully forward/backward - ms
var fullDepth = 30.5; // max expansion from wall - cm
var fullOrientationChange = 13000;  // how long it takes for the tv support to rotate from fully left to fully right & vice versa - ms
var completeRotation = 60; // degree of freedom for the tv orientation - deg

// TODO: add handling of % & a 'map(val, inMin, inMax, outMin, outMax)' fcn for 'expandTo' & 'swivelTo'

// FOLLOWING WORKS FINE WITH testSig2(signals2[0]), so get longer versions of other codes :)
var signals = [
  [ 4.71496582031, 4.53948974609, 9.48238372802, 4.53948974609, 27.93693542480, 31.50844573974, 4.71878051757, 4.53567504882, 9.48619842529, 4.53472137451, 46.630859375, 31.51321411132, 4.71496582031, 4.53948974609, 9.48238372802, 4.53948974609, 27.93598175048, 31.51035308837, 4.71687316894, 4.53662872314, 9.48524475097, 4.53662872314 ], // 0 - in
  [ 14.24884796142, 4.54139709472, 51.41735076904, 31.53038024902, 14.24980163574, 4.54044342041, 32.72056579589, 31.52847290039, 14.25361633300, 4.53662872314, 51.42211914062, 31.52656555175, 14.25457000732, 4.53567504882, 32.72628784179, 31.52370452880, 14.25552368164, 4.53281402587 ], // 1 - out
  [ 4.72068786621, 4.54521179199, 4.71782684326, 4.53758239746, 27.94933319091, 36.01837158203, 4.72164154052, 4.54425811767, 4.71782684326, 4.53853607177, 46.63467407226, 36.01646423339, 4.72450256347, 4.54139709472, 4.72164154052, 4.56523895263, 27.92263031005, 36.01360321044, 4.72450256347, 4.54235076904, 4.72068786621, 4.53472137451 ], // 2 - left
  [ 4.71496582031, 4.54044342041, 32.70912170410, 40.52066802978, 4.71496582031, 4.53948974609, 51.40399932861, 40.54546356201, 4.69207763671, 4.56428527832, 32.68432617187, 40.51303863525, 4.72164154052, 4.53376770019, 51.41735076904, 40.48156738281, 4.75502014160, 4.50992584228, 32.73677825927, 40.49110412597, 4.74452972412, 4.51087951660 ], // 3 - right
  [ 4.71591949462, 4.53948974609, 4.72259521484, 4.54235076904, 37.46986389160, 27.01663970947, 4.72164154052, 4.54425811767, 4.71782684326, 4.53758239746, 56.16092681884, 27.01950073242, 4.72068786621, 4.54521179199, 4.71687316894, 4.53853607177, 37.47463226318, 27.02426910400, 4.71591949462, 4.53948974609, 4.72259521484, 4.54330444335, 56.15615844726, 27.02140808105, 4.71878051757, 4.53662872314, 4.72545623779, 4.54044342041, 37.47177124023, 27.01473236083, 4.72450256347, 4.54139709472, 4.72068786621, 4.53472137451 ], // 4 - ok
  [ 0, 22.48954772949, 19.04201507568, 13.50879669189, 27.97412872314, 22.52292633056, 19.00959014892, 13.54122161865 ], // 5 - fav1
  [ 0, 22.49526977539, 9.51004028320, 4.51278686523, 9.51385498046, 4.50992584228, 32.73963928222, 22.48859405517, 9.51766967773, 4.51564788818, 9.51004028320, 4.51374053955 ] // 6 - fav2
];

// shortcuts
var tvSupportRemote = {
  in: function(){ testSig2(signals[0]); },
  out: function(){ testSig2(signals[1]); },
  left: function(){ testSig2(signals[2]); },
  right: function(){ testSig2(signals[3]); },
  ok: function(){ testSig2(signals[4]); },
  
  kitchen: function(){ testSig2(signals[1]); setTimeout(function(){ testSig2(signals[2]); }, fullDepthChange); },
  bed: function(){ testSig2(signals[1]); setTimeout(function(){ testSig2(signals[3]); }, fullDepthChange); },
  
  // works ?
  that: this,
  
  halfLeft: function(){ 
    /*
    testSig2(signals[1]); 
    setTimeout(function(){ 
      testSig2(signals[2]);
      setTimeout(function(){ testSig2(signals[4]);  }, fullOrientationChange/2);
    }, fullDepthChange);
    */
    that.swivelTo(-50); // go half left
  },
  
  halfRight: function(){ 
    /*
    testSig2(signals[1]); 
    setTimeout(function(){ 
      testSig2(signals[3]);
      setTimeout(function(){ testSig2(signals[4]);  }, fullOrientationChange/2);
    }, fullDepthChange);
    */
    that.swivelTo(50); // go half right
  },
  
  fav1: function(){ testSig2(signals[5]); }, // '1' then 'ok'
  fav2: function(){ testSig2(signals[6]); }, // '2' then 'ok'
  
  // expand to a specific % of the full depth
  expandTo: function(expandPerc){
    var expSigIdx = expandPerc < 0 ? 0: 1; // -% -> to wall, +% -> off wall
    testSig2(signals[expSigIdx]); // start expanding
    setTimeout(function(){ testSig2(signals[4]); }, map(expandPerc, 0, 100, 0, fullDepthChange) ); 
  },
  
   // swivel to a specific ° of orientation
  swivelTo: function(swivelPerc){
    var dirSigIdx = swivelPerc < 0 ? 2: 3; // -% -> go left, +% -> go right
    swivelPerc = swivelPerc < 0 ? -swivelPerc: swivelPerc; // if negative, positiv-it(y)
    testSig2(signals[dirSigIdx]); // start swivelling
    setTimeout(function(){ testSig2(signals[4]); }, map(swivelPerc, 0, 100, 0, fullOrientationChange/2) );
  },
};

// PERFECT TO BUILD UPON :D
function testSig2(sigArr){
  digitalWrite(LED3,1);
  analogWrite(irLed_anodePin,0.9,{freq:38000});
  digitalPulse(irLed_cathodePin, 1, sigArr);
  digitalPulse(irLed_cathodePin, 1, 0);
  digitalRead(irLed_anodePin);
  digitalWrite(LED3,0);
}

// Helper
var map = function(val, fromMin, fromMax, toMin, toMax){ return (val - fromMin) * (toMax - toMin) / (fromMax - fromMin) + toMin; };

// R: stop watching when transmitting if handling both
function pulseSig(idx){
  digitalWrite(LED1,1); // light up LED1 to indicate transmission
  //analogWrite(irLed_anodePin,0.9,{freq:38000, soft: true}); // when using a non-PWM-capable pin
  //analogWrite(irLed_anodePin,0.9,{freq:38000}); // start the 38kHz square wave ( on the IR LED's cathode* pin )
  digitalPulse(irLed_cathodePin, 1, signals[idx]); // send the pulses to IR LED ( on the IR LED's anode* pin )
  //digitalPulse(LED3,1,signals[idx]); // send the pulses to onboard LED
  digitalPulse(irLed_cathodePin, 1, 0); // wait until pulsing is finished on IR LED
  //digitalPulse(LED3,1,0); // wait until pulsing is finished on IR LED
  digitalRead(irLed_anodePin); // stop 38kHz square wave
  digitalWrite(LED1,0); // turn LED1 off
}

console.log('Hello tv support world !');
