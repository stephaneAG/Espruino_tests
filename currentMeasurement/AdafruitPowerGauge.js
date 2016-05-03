var dataBuff = ''; // 'll hold the messages from the Power Gauge's serial TTL output ( ATtiny85's Tx pin )
var voltage = ''; // the voltage parsed from the above data buff
var current = ''; // the current parsed from the above data buff
var watts = ''; // the watts parsed from the above data buff

// dummy test in browser
/*
var typicalRead = 'V: 5.5 I: 916 mA Watts: 5.1'
var typicalRead_voltage = typicalRead.substr(typicalRead.indexOf('V: ')+'V: '.length, typicalRead.indexOf(' I:')-' I:'.length );
var typicalRead_current = typicalRead.substr(typicalRead.indexOf('I: ')+'I: '.length, typicalRead.indexOf(' mA Watts:')-' mA Watts:'.length );
var typicalRead_watts = typicalRead.substr(typicalRead.indexOf('Watts: ')+'Watts: '.length );

typicalRead
"V: 5.5 I: 916 mA Watts: 5.1"
typicalRead_voltage + 'V'
"5.5V"
typicalRead_current + 'mA'
"916mA"
typicalRead_watts + 'watts'
"5.1watts"
*/
/* ---- Espruino code ---- */

Serial4.setup(9600); // aka: use default Serial4 Rx pin ( C11 on original Espruino board )
Serial4.on('data', function(data){
  dataBuff += data;
  //if ( dataBuff.indexOf('\r') !== -1 ){
  if ( dataBuff.indexOf('\n') !== -1 ){ // this may be the trick ? => INDEED ;P
    //print('Power Gauge Data: ' + dataBuff); // echo to USB console ( != than Serial4.print .. )
    //print(dataBuff.substr(0, dataBuff.indexOf('\r')));
    print(dataBuff); // prints perfectly EVERYTHING ^^

    // parse the data buff
    voltage = dataBuff.substr(dataBuff.indexOf('V: ')+'V: '.length, dataBuff.indexOf(' I:')-' I:'.length );
    current = dataBuff.substr(dataBuff.indexOf('I: ')+'I: '.length, dataBuff.indexOf(' mA Watts:')-' mA Watts:'.length );
    watts = dataBuff.substr(dataBuff.indexOf('Watts: ')+'Watts: '.length );

    // quick debug logs
    print( 'Power Gauge Data => voltage: ' + voltage + 'V, current: ' + current + 'mA, watts: ' + watts)
    
    // handle the log data & relate it to the current state of a plug to determine what to do ( toggle LED, send SMS, ..)
    handleGaugeUpdate(voltage, current, watts);

    dataBuff = ''; // clear/reset data buff
    //dataBuff = data; // eating my V: ? -> nope, it was the line ending used ( that was not '\r' but '\n' )
  }
});


function handleGaugeUpdate(voltage, current, watts){
  // TODO: average stuff across multiple reading/calls of this fcn to gain precision over the measurements & related "state"
  print('Gauge update handler called :) !')
}
