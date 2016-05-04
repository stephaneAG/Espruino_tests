/* powerConsumption_wip.js - wip implementation of the overall logic */

/*
TODO:
- handle 'steps'
- handle 'somewhat fastly decreasing current' ( for devices that got their screen briefly( receiving a notification or stg .. )
- handle SMS sending
- handle 'box spaces' or direct SMS sending

*/

/* ---- Espruino code ---- */

var dataBuff = ''; // 'll hold the messages from the Power Gauge's serial TTL output ( ATtiny85's Tx pin )
var voltage = ''; // the voltage parsed from the above data buff
var current = ''; // the current parsed from the above data buff
var watts = ''; // the watts parsed from the above data buff

// added for wip
var powerSource = 'wallOutlet'; / or 'usb'
var deviceConnected = false; // if a device is currently connected or not
var devicePreviouslyConnected = false; // if a device was previously connected or not
var wallOutletMaxCurrent = 1000; // the maximum current provided/that can be drawn from a wall outlet, in mA - could be updated based on the readings ( .. )
var usbMaxCurrent = 500; // the maximum current provided/that can be drawn from a usb port, in mA - could be updated based on the readings ( .. )
var deviceConnectedThreshold = 50; // minimum current to be drawn by a device for being detected as 'connected'
var deviceChargedCurrentDropMin_wallOutlet = 150; // when current drawn === wallOutletMaxCurrent - this, the device sohould be fully charged
var deviceChargedCurrentDropMin_usb = 75; // when current drawn === usbMaxCurrent - this, the device sohould be fully charged NB: UNTESTED YET !

Serial4.setup(9600); // aka: use default Serial4 Rx pin ( C11 on original Espruino board )
Serial4.on('data', function(data){
  dataBuff += data;
  //if ( dataBuff.indexOf('\r') !== -1 ){
  if ( dataBuff.indexOf('\n') !== -1 ){ // this may be the trick ? => INDEED ;P
    //print('Power Consumption Data: ' + dataBuff); // echo to USB console ( != than Serial4.print .. )
    //print(dataBuff.substr(0, dataBuff.indexOf('\r')));
    print(dataBuff); // prints perfectly EVERYTHING ^^

    // parse the data buff
    voltage = dataBuff.substr(dataBuff.indexOf('V: ')+'V: '.length, dataBuff.indexOf(' I:')-' I:'.length );
    current = dataBuff.substr(dataBuff.indexOf('I: ')+'I: '.length, dataBuff.indexOf(' mA Watts:')-' mA Watts:'.length );
    watts = dataBuff.substr(dataBuff.indexOf('Watts: ')+'Watts: '.length );

    // quick debug logs
    print( 'Power Consumption Data => voltage: ' + voltage + 'V, current: ' + current + 'mA, watts: ' + watts)
    
    // handle the log data & relate it to the current state of a plug to determine what to do ( toggle LED, send SMS, ..)
    handleGaugeUpdate(voltage, current, watts);

    dataBuff = ''; // clear/reset data buff
    //dataBuff = data; // eating my V: ? -> nope, it was the line ending used ( that was not '\r' but '\n' )
  }
});


function handleGaugeUpdate(voltage, current, watts){
  // TODO: average stuff across multiple reading/calls of this fcn to gain precision over the measurements & related "state"
  print('Power Consumption update handler called :) !');
  
  // check if a device is connected
  if ( voltage !== 0.0 ){ 
    deviceConnected = true;
    print('A device is connected');
  } else {
    deviceConnected = false;
    print('No device connected');
  }
  
  // check if a device's connection status changed
  if( deviceConnected !== devicePreviouslyConnected){ // a device was recently connected or disconnected
    
    if ( deviceConnected === true ){ // a device ( that previously wasn't ) was recently connected
      // onboard BLUE LED ON
      // log stuff to SD
      // send SMS 'busy/occupied' OR update local 'boxSpacesStatus' string;
    } else { // a device ( that was previously connected ) was recently disconnected
      all LEDs OFF
      // log stuff to SD
      // send SMS 'free/available' OR update local 'boxSpacesStatus' string;
    }
    
    devicePreviouslyConnected = deviceConnected; // update the device's connection status
  }
  
  // act depending whether as device is charging or has already charged
  if ( deviceConnected === true ){ // else, no need to adjust stuff
  
    // re-adjust current max drawn
    if ( powerSource === 'wallOutlet' && current >= wallOutletMaxCurrent ){ wallOutletMaxCurrent = current; }
    else if ( powerSource === 'usb' && current >= usbMaxCurrent ){ usbMaxCurrent = current; }
    
    // check if the connected device is still charging or already charged
    if ( powerSource === 'wallOutlet' && current <= wallOutletMaxCurrent - deviceChargedCurrentDropMin_wallOutlet ){
      // no that much current drawn -> the device should be fully charged
      // RED LED OFF
      // GREEN LED ON
      // log stuff to SD
      // send SMS 'used/charged' OR update local 'boxSpacesStatus' string;
    } else if ( powerSource === 'usb' && current <= usbMaxCurrent - deviceChargedCurrentDropMin_usb ){
      // the current drawn is above the specified threshold -> the device should be currently charging
      // R: todo -> look for "somewhat fastly decreasing current" ( .. )
      // RED LED ON
      // log stuff to SD
      // send SMS 'used/charging' OR update local 'boxSpacesStatus' string;
    }
    
  }
  
}
