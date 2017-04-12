/*
R: pin mapping

ESP8266 | Espruino | D1 Mini Pro | Reserved
GPIO5   | D5       | D1          |
GPIO4   | D4       | D2          |
GPIO0   | D0       | D3          |*
GPIO2   | D2       | D4          |*
GPIO14  | D14      | D5          |
GPIO12  | D12      | D6          |
GPIO13  | D13      | D7          |
GPIO15  | D15      | D8          |*

aka
digitalWrite(D14, 1); // D5 pin
digitalWrite(D12, 1); // D6 pin
digitalWrite(D13, 1); // D7 pin
// didn't work for Espruino D15/D1 Mini Pro D8 pin
digitalWrite(D5, 1); // D1 pin
digitalWrite(D5, 1); // D2 pin
*/

/* TV support remote test code for the D1 Mini Pro */
// R: the following 2 didn't work - maybe cause of the new hardware, non-pwm pins, or faulty code ..
//.. or not enough juice ? ( aka try with a transistor added ? )
var irLed_anodePin = D14; // D1 Mini Pro D5
var irLed_cathodePin = D12; // D1 Mini Pro D6

//var irLed_anodePin = D14; // not working either ..
//var irLed_cathodePin = D12; // not working either ..
var LED_pin = D13; // D1 Mini Pro D7

// tv support IR codes
var signals = [
  [ 4.71496582031, 4.53948974609, 9.48238372802, 4.53948974609, 27.93693542480, 31.50844573974, 4.71878051757, 4.53567504882, 9.48619842529, 4.53472137451, 46.630859375, 31.51321411132, 4.71496582031, 4.53948974609, 9.48238372802, 4.53948974609, 27.93598175048, 31.51035308837, 4.71687316894, 4.53662872314, 9.48524475097, 4.53662872314 ], // 0 - in
  [ 14.24884796142, 4.54139709472, 51.41735076904, 31.53038024902, 14.24980163574, 4.54044342041, 32.72056579589, 31.52847290039, 14.25361633300, 4.53662872314, 51.42211914062, 31.52656555175, 14.25457000732, 4.53567504882, 32.72628784179, 31.52370452880, 14.25552368164, 4.53281402587 ], // 1 - out
  [ 4.72068786621, 4.54521179199, 4.71782684326, 4.53758239746, 27.94933319091, 36.01837158203, 4.72164154052, 4.54425811767, 4.71782684326, 4.53853607177, 46.63467407226, 36.01646423339, 4.72450256347, 4.54139709472, 4.72164154052, 4.56523895263, 27.92263031005, 36.01360321044, 4.72450256347, 4.54235076904, 4.72068786621, 4.53472137451 ], // 2 - left
  [ 4.71496582031, 4.54044342041, 32.70912170410, 40.52066802978, 4.71496582031, 4.53948974609, 51.40399932861, 40.54546356201, 4.69207763671, 4.56428527832, 32.68432617187, 40.51303863525, 4.72164154052, 4.53376770019, 51.41735076904, 40.48156738281, 4.75502014160, 4.50992584228, 32.73677825927, 40.49110412597, 4.74452972412, 4.51087951660 ], // 3 - right
  [ 4.71591949462, 4.53948974609, 4.72259521484, 4.54235076904, 37.46986389160, 27.01663970947, 4.72164154052, 4.54425811767, 4.71782684326, 4.53758239746, 56.16092681884, 27.01950073242, 4.72068786621, 4.54521179199, 4.71687316894, 4.53853607177, 37.47463226318, 27.02426910400, 4.71591949462, 4.53948974609, 4.72259521484, 4.54330444335, 56.15615844726, 27.02140808105, 4.71878051757, 4.53662872314, 4.72545623779, 4.54044342041, 37.47177124023, 27.01473236083, 4.72450256347, 4.54139709472, 4.72068786621, 4.53472137451 ], // 4 - ok
  [ 0, 22.48954772949, 19.04201507568, 13.50879669189, 27.97412872314, 22.52292633056, 19.00959014892, 13.54122161865 ], // 5 - fav1
  [ 0, 22.49526977539, 9.51004028320, 4.51278686523, 9.51385498046, 4.50992584228, 32.73963928222, 22.48859405517, 9.51766967773, 4.51564788818, 9.51004028320, 4.51374053955 ] // 6 - fav2
];

// helper fcn
function testSig(sigArr){
  analogWrite(irLed_anodePin,0.9,{freq:38000});
  digitalPulse(irLed_cathodePin, 1, sigArr);
  digitalPulse(irLed_cathodePin, 1, 0);
  digitalRead(irLed_anodePin);
}

// light version
function testSig2(sigArr){
  digitalWrite(LED_pin,1);
  analogWrite(irLed_anodePin,0.9,{freq:38000}); // R: {.., soft: true}); // when using a non-PWM-capable pin
  digitalPulse(irLed_cathodePin, 1, sigArr);
  digitalPulse(irLed_cathodePin, 1, 0);
  digitalRead(irLed_anodePin);
  digitalWrite(LED_pin,0);
}

// when using a non-PWM-capable pin for analogWrite
function testSig3(sigArr){
  digitalWrite(LED_pin,1);
  analogWrite(irLed_anodePin,0.9,{freq:38000, soft: true});
  digitalPulse(irLed_cathodePin, 1, sigArr);
  digitalPulse(irLed_cathodePin, 1, 0);
  digitalRead(irLed_anodePin);
  digitalWrite(LED_pin,0);
}

// connect to wifi - wip
var wifi = require('Wifi');
wifi.connect("Seedsdesign",{ password: "jaimelesfraisesdesbois666"}, function(err) {
  if (err) console.log(err);
  else console.log("Connected");
});
// after 8 secs:
// wifi.getStatus()
/*
{
  "mode": "sta+ap",
  "station": "connected",
  "ap": "enabled",
  "phy": "11n",
  "powersave": "ps-poll",
  "savedMode": "off"
 }
*/
// wifi.getIP()
/*
{
  "ip": "192.168.1.18",
  "netmask": "255.255.255.0",
  "gw": "192.168.1.1",
  "mac": "5c:cf:7f:3c:89:ee"
 }
*/
// wifi.setDHCPHostname('WemosTvSupport')
// then
// wifi.save()
// to verify that we can connect with the IDE over wifi, check with netcat ;)
// nc <ip> 23
// Ctrl+C to quit
