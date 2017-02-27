/* motorized TV support IR codes v0.1a - StephaneAG 2017 

  Silly yet working quickie that currently handles receiving only

*/

var lastTime = 0;
var timeout;
var code = 0; // code buffer for code being received
var prevPulse = 0; // previous pulse to deduce current code from

// function to do something with the code when we get it
function handleCode() {
  timeout = undefined;
  //print(code);
  if ( code === 1 ){
    print('OK BTN'); 
    digitalWrite(LED1,1);
    digitalWrite(LED2,1);
    digitalWrite(LED3,1);
  }
  if ( code === 2 ){
    print('DOWN BTN'); 
    digitalWrite(LED1,0); 
    digitalWrite(LED2,0); 
    digitalWrite(LED3,0);
  }
  if ( code === 3 ) { print('RIGHT BTN'); digitalWrite(LED3,1); }
  if ( code === 4 ) { print('UP BTN'); digitalWrite(LED2,1); }
  if ( code === 5 ) { print('LEFT BTN'); digitalWrite(LED1,1); }
  print('\n');
  code = 0;
}

/* tef's silly logic */
function onPulseOn(e) {
  var pulseTime = e.time - lastTime;
  //prevPulse = pulseTime; // to deduce the code in a lazy manner - works better after ;)
  //print('pulse time: ' + pulseTime );
  //if ( pulseTime > 0.057 ) print('start code');
  //if ( pulseTime > 0.046 && pulseTime < 0.057 ) print('stop code');
  if( pulseTime < 0.046 ){ // not a 'stop' nor 'start' pulse
    if( pulseTime > 0.037 ){
      //print('part of OK code');
      code = 1; // OK BTN
    }
    else if( pulseTime > 0.032 ) {
      //print('part of RIGHT or DOWN code');
      if ( prevPulse > 0.014 ){
        //print('part of DOWN code');
        code = 2; // DOWN BTN
      }
      else if ( prevPulse > 0.004 ){
        //print('part of RIGHT code');
        code = 3; // RIGHT BTN
      }
    }
    else if( pulseTime > 0.027 ){
      //print('part of UP or LEFT code');
      if ( prevPulse > 0.009 ){
        //print('part of UP code');
        code = 4; // UP BTN
      }
      else if ( prevPulse > 0.004 ){
        //print('part of LEFT code');
        code = 5; // LEFT BTN
      }
    }
  }
  //if ( (e.time - lastTime) > 0.046 ) print('stop code'); // gets printed every btn press
  //code = (code + Math.round(e.time - lastTime) * 1000) | ((e.time - lastTime) > 0.0001);
  if (timeout!==undefined) clearTimeout(timeout);
  timeout = setTimeout(handleCode, 100);
  lastTime = e.time;
  prevPulse = pulseTime; // to deduce the code in a lazy manner ;p
}


function onPulseOff(e) {
  lastTime = e.time;
}
setWatch(onPulseOff, A0, { repeat:true, edge:"rising" });
setWatch(onPulseOn, A0, { repeat:true, edge:"falling" });

pinMode(A0,"input_pullup");
