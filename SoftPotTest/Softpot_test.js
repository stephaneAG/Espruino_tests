/* Softpot test */

/*
var prevSoftpotRead = analogRead(A0);
var checkTouch_timeout = undefined;

checkTouch_timeout = setTimeout(function checkTouch(){
  var currSoftpotRead = analogRead(A0);
  if( currSoftpotRead !== prevSoftpotRead ){
    console.log('curr softpot read: ' + currSoftpotRead);
    // we could handle touch here, in a dedicated fcn that 'd have its own loop ( using intervals ? )
    checkTouch_timeout = setTimeout(checkTouch, 100); // nice for debug
    prevSoftpotRead = currSoftpotRead; // update
  } else {
    //console.log('nothing happended ..');
    checkTouch_timeout = setTimeout(checkTouch, 10); // continue checking for touchstart / touchend
  }
}, 100);
*/

var untouchedVoltage = 0.99977111467; // voltage read when not touched
var touchedThreshold = 0.000488289; // minimum voltage drop when touched
var degStepVariation = 0.001285149; // the minimum voltage change for 1°
var areaVariationRange = 0.028915847; // the minimum voltage variation for 22.5°

var prevSoftpotRead = undefined;

var potInterval = undefined;
var potCheckInterval = 500; // how many times a second we check for touch

// in order to "bridge" the gap ( and use the softpot as a rotary encoder ;p )
var bridgeDiscarded = true; // discarded when too much time elapsed since we had area 1 max value
var bridgeDiscardTimeout = undefined; // the time in which "bridging the gap" is accepted
var valueBeforeUntouched = undefined; // if bridge is not discarded when checking touches, adjust prevTouchVal 
// R: "adjusting" prevTouchVal means setting it to a lower val than area 16 min when going CCW
//    and to a bigger value than area 1 max when going CW
// Nb: if the aboves do the trick in the next wip implm of the below fcn, I AM HAPPY ! :D

function checkTouch(){
  var currSoftpotRead = analogRead(A0);
  
  // currently being touched
  if( currSoftpotRead < untouchedVoltage - touchedThreshold ){
    //console.log('BEING TOUCHED read: ' + currSoftpotRead);
    // check if we previously had a touch
    if( prevSoftpotRead !== undefined ){
    // & if so, check how far it was based on the saved analog value:
    // check if prevSoftpotRead is > or <, then
      if ( prevSoftpotRead > currSoftpotRead + degStepVariation*10 ){ // going CW
        console.log('.. going clockwise ..');
      } else if ( prevSoftpotRead < currSoftpotRead - degStepVariation*10 ){ // going CCW
        console.log('.. going counter-clockwise ..');
      } else {
        console.log('.. currently static ..');
      }
      prevSoftpotRead = currSoftpotRead; // update the touch state/val
    } else {
      prevSoftpotRead = currSoftpotRead; // update the touch state/val
    }
   
  // not currently being touched  
  } else {
    //console.log('NO TOUCH read: ' + currSoftpotRead);
    // check if we previously had a touch ?
    // .. ?
    prevSoftpotRead = undefined; // reset prev touch
  }
}

// start stuff
potInterval = setInterval(checkTouch, potCheckInterval);
