var TX = A0;
var CODE = 0b10100000111111101110;

function sendCommand(command) {
  var bits = (CODE & ~0b11111) | command;
  for (var i=24;i>=0;i--) {
    if ((bits>>i)&1) {
      digitalPulse(TX,1,0.9);
      digitalPulse(TX,0,0.3);
    } else {
      digitalPulse(TX,1,0.3);
      digitalPulse(TX,0,0.9);
    }
  }
  digitalPulse(TX,1,0.001);
}

function sendMultiple(command) {
  var n = 10;
  var interval = setInterval(function() {
    sendCommand(command);
    if (n-- < 0) clearInterval(interval);
  }, 50);
}

var socketOn = false;
setWatch(function() {
  socketOn = !socketOn;
  sendMultiple(socketOn ? 0b11110 : 0b01110);
}, BTN1, { repeat:true, edge:"rising", debounce:10 });
