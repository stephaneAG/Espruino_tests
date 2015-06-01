// the gamepad controls states pattern updated via serial conn
var gamepadControlsStatesURI="lol";

Serial1.setup(9600); // baud
Serial1.on('data', function () { 
  //Serial1.print("Received :" + data);
  Serial1.print("Trollollo !");
  
});

USB.setup(9600);
USB.on('data', function () { 
  //Serial1.print("Received :" + data);
  USB.print("Trollollo !");
  
});
