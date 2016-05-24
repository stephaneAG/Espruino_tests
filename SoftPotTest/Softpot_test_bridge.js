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
var potCheckInterval = 100; // how many times a second we check for touch

// in order to "bridge" the gap ( and use the softpot as a rotary encoder ;p )
var bridgeDiscarded = true; // discarded when too much time elapsed since we had area 1 max value
var bridgeDiscardTimeout = undefined; // the timeiut set to discard a possible bridge after the below delay
var bridgeDiscardDelay = 400; // the time in which "bridging the gap" is accepted
var valueBeforeUntouched = undefined; // if bridge is not discarded when checking touches, adjust prevTouchVal 
// R: "adjusting" prevTouchVal means setting it to a lower val than area 16 min when going CCW
//    and to a bigger value than area 1 max when going CW
// Nb: if the aboves do the trick in the next wip implm of the below fcn, I AM HAPPY ! :D
var bridgeBiggerSideMax = 0.99928282597; // area 1 max
var bridgeBiggerSideMin = 0.98634317540; // area 1 min
var bridgeLowerSideMax = 0.56519417105; // area 16 max
var bridgeLowerSideMin = 0.53662928206; // area 16 min


function checkTouch(){
  var currSoftpotRead = analogRead(A0);
  
  // adjustements to "bridge the gap" - nb: maybe to be moved little below ( like one scope ? )
  // "bridging" a CCW gap
  if( valueBeforeUntouched > bridgeBiggerSideMax - degStepVariation*10 && currSoftpotRead < bridgeLowerSideMax /* && bridgeDiscarded === false*/ ){
    prevSoftpotRead = bridgeLowerSideMin - areaVariationRange/2; // "adjust" prevSoftpotRead to a lower value than area 16 min
    console.log('.. bridging CCW gap ..');
    
  // "bridging" a CW gap
  } else if( valueBeforeUntouched < bridgeLowerSideMin + degStepVariation*10 && currSoftpotRead > bridgeBiggerSideMin /* && bridgeDiscarded === false*/ ){
    prevSoftpotRead = bridgeBiggerSideMax + areaVariationRange/2; // "adjust" prevSoftpotRead to a bigger value than area 1 max
    console.log('.. bridging CW gap ..');
  }
  
  // OR, replace the above by an even dumber version ? ( really, I only care about "direction continiuum" ^^ )
  
  
  // currently being touched
  if( currSoftpotRead < untouchedVoltage - touchedThreshold ){
    //console.log('BEING TOUCHED read: ' + currSoftpotRead);
    // check if we previously had a touch
    if( prevSoftpotRead !== undefined ){
    // & if so, check how far it was based on the saved analog value:
    // check if prevSoftpotRead is > or <, then ..
      //if ( prevSoftpotRead > currSoftpotRead + degStepVariation*10 ){ // going CW
      if ( prevSoftpotRead > currSoftpotRead + degStepVariation*4 ){ // going CW - LESS STATIC :D
      //console.log('.. going clockwise ..');
      // TODO: HANDLE CW
      //} else if ( prevSoftpotRead < currSoftpotRead - degStepVariation*10 ){ // going CCW
      } else if ( prevSoftpotRead < currSoftpotRead - degStepVariation*4 ){ // going CCW - LESS STATIC :D
        //console.log('.. going counter-clockwise ..');
        // TODO: HANDLE CCW
      } else {
        //console.log('.. currently static ..');
        // TODO: HANDLE STATIC
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
    valueBeforeUntouched = prevSoftpotRead; // save latest value for maybe "bridging" on next touch
    bridgeDiscardTimeout = setTimeout(function(){ bridgeDiscarded = true; }, bridgeDiscardDelay); // set a timeout to discard the gap bridging after some time
    prevSoftpotRead = undefined; // reset prev touch
  }
}

// start stuff
potInterval = setInterval(checkTouch, potCheckInterval);
