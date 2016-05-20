var prevSoftpotRead = analogRead(A0);
var checkTouch_timeout = undefined;

checkTouch_timeout = setTimeout(function checkTouch(){
  var currSoftpotRead = analogRead(A0);
  if( currSoftpotRead !== prevSoftpotRead ){
    console.log('curr softpot read: ' + currSoftpotRead);
    // we could handle touch here, in a dedicated fcn that 'd have its own loop ( using intervals ? ) -> to control sound ;p
    checkTouch_timeout = setTimeout(checkTouch, 10); // nice for debug
    prevSoftpotRead = currSoftpotRead; // update
  } else {
    //console.log('nothing happended ..');
    checkTouch_timeout = setTimeout(checkTouch, 10); // continue checking for touchstart / touchend
  }
}, 10);



// for debug -> less data
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



// differentiate touchstart from touchend
// when touched, register the smallest steps ( while averaging if possible )
// to detect the direction, we check if the curr voltage is bigger or smaller than the previous one
// to detect the speed, we check the difference between the current voltage & the previous one:
//   depending on how many "smallest steps" it can be divided into, we alter the playback rate by some corresponding amount
// Nbs:
// - the "smallest steps" could/should be configurable
// - the speed <-> playbackrate mapping could/should be mappable in its sensibility ( "how far", as smallestSteps/timeBetweenTwoReads, represents "how much")
