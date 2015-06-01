var t,n;

// When the signal rises, check if it was after ~5ms of delay - if so (and if we have a code) display it.
function sigOn(e) {
  var d = e.time-t;
  if (d>0.005 && n>0) {
    console.log("0b"+n.toString(2));
    n=0;
  }
  t = e.time;
}

// When the signal falls, measure the length of our pulse. 
// If it was within range, record a 1 or a 0 depending on the length. 
// If it wasn't in range, zero it
function sigOff(e) {
  var d = e.time-t;
  t = e.time;
  if (d>0.0001 && d<0.001)
    n = (n<<1) | ((d>=0.0004)?1:0);
  else
    n=0;
}

setWatch(sigOn,A0,{repeat:true,edge:"rising"});
setWatch(sigOff,A0,{repeat:true,edge:"falling"});
