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
