var dataBuff = ''; // 'll hold the messages from the Power Gauge's serial TTL output ( ATtiny85's Tx pin )
var voltage = ''; // the voltage parsed from the above data buff
var current = ''; // the current parsed from the above data buff
var watts = ''; // the watts parsed from the above data buff

// dummy test
var typicalRead = 'Power Gauge Data:  5.5 I: 1098 mA Watts: 6.0'


/* ---- Espruino code ---- */
Serial4.setup(9600); // aka: use default Serial4 Rx pin ( C11 on original Espruino board )
Serial4.on('data', function(data){
  dataBuff += data;
  if ( dataBuff.indexOf('\r') !== -1 ){
    print('Power Gauge Data: ' + dataBuff); // echo to USB console ( != than Serial4.print .. )

    // parse the data buff
    

    dataBuff = ''; // clear/reset data buff
  }
});
