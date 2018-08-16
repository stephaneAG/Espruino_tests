var kb = require("USBKeyboard");

I2C1.setup({scl:B6, sda:B7});
var tcs = require("TCS3472x").connect(I2C1, 1 /*integration cycles*/, 1 /*gain*/);

kb.toggleMapping = function(){ kb.KEY.Q = [ kb.KEY.A, kb.KEY.A=kb.KEY.Q][0]; kb.KEY.W = [ kb.KEY.Z, kb.KEY.Z=kb.KEY.W][0]; };
kb.toggleMapping(); // from default qwerty to azerty

setWatch(function() {
  LED1.toggle();
  var v = tcs.getValue();
  var min = Math.min(v.red, v.green, v.blue);
  var range = Math.max(v.red, v.green, v.blue) - min;
  var rgb = [ // values between 0 and 255
    (v.red - min)*255/range,
    (v.green - min)*255/range,
    (v.blue - min)*255/range,
  ];
  kb.type('rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')', function() {
    LED1.toggle();
  });
}, BTN, {debounce:100,repeat:true, edge:"rising"});
