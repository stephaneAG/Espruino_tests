var TX = A0;
//var CODE = 0b10100000111111101110;
var CODE = 0b10000100101011100101;

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
  print("send "+command);
  var n = 10;
  var interval = setInterval(function() {
    sendCommand(command);
    if (n-- < 0) clearInterval(interval);
  }, 50);
  console.log('mains socket command sent !');
}

function pageHandler(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var u = url.parse(req.url, true);
  res.write('<html><body>Sockets: <a href="/?s0=off">all off</a> 1<a href="/?s1=on">on</a> or <a href="/?s1=off">off</a> 2<a href="/?s2=on">on</a> or <a href="/?s2=off">off</a> 3<a href="/?s3=on">on</a> or <a href="/?s3=off">off</a> 4<a href="/?s4=on">on</a> or <a href="/?s4=off">off</a> </body></html>');
  if (u.query !== null) {
    //if (u.query["s1"]=="on") sendMultiple(0b11110);
    //if (u.query["s1"]=="off") sendMultiple(0b01110);
    if (u.query["s0"]=="off") sendMultiple(0b10000); // all off
    if (u.query["s1"]=="on") sendMultiple(0b11110); // 1 on
    if (u.query["s1"]=="off") sendMultiple(0b01110); // 1 off
    if (u.query["s2"]=="on") sendMultiple(0b10110); // 2 on
    if (u.query["s2"]=="off") sendMultiple(0b00110); // 2 off
    if (u.query["s3"]=="on") sendMultiple(0b11010); // 3 on
    if (u.query["s3"]=="off") sendMultiple(0b01010); // 3 off
    if (u.query["s4"]=="on") sendMultiple(0b11100); // 4 on
    if (u.query["s4"]=="off") sendMultiple(0b01100); // 4 off
  }
  res.end();
}

var wlan = require("CC3000").connect();
//wlan.connect( "AccessPointName", "WPA2key", function (s) { 
wlan.connect( "Seedsdesign", "jaimelesfraisesdesbois666", function (s) {
  if (s=="dhcp") {
    console.log("Connect to http://"+wlan.getIP().ip);
    require("http").createServer(pageHandler).listen(80);
  }
});
