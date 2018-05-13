/* ==== WIP MODULE ==== */

var exports={}; // added to test for right hand side of the IDE

/* Copyright (c) 2018 StéphaneAG. See the file LICENSE for copying permission. */
/*
Library for interfacing the ModernDevices Wind Sensor Rev C
Adapted from Arduino code by Paul Badger 2014
https://github.com/moderndevice/Wind_Sensor/blob/master/WindSensor/WindSensor.ino
See https://moderndevice.com/news/wind-sensor-calibration/ for original Arduino calibration
```
var windSensor = require('WindSensor').connect(outInputPin, RvInputPin, TmpInputPin, function(err){
  if(!err){
    // register callback handler
    windSensor.registerHandler(function(sensorReadings){
      // here, do stuff with Out, Rv & Temp
      console.log(sensorReadings);
    });
  } else {
    console.log(err);
  }
});
```
*/

var C = {
  MY : 0x001,          // description
  PRIVATE : 0x001,     // description
  CONSTANTS : 0x00423  // description
};

function WINDSENSOR(pin1,pin2) {
  this.pin1 = pin1;
  this.pin2 = pin2;
}

/** 'public' constants here */
WINDSENSOR.prototype.C = {
  MY : 0x013,         // description
  PUBLIC : 0x0541,    // description
  CONSTANTS : 0x023   // description
};

/** Put most of my comments outside the functions... */
WINDSENSOR.prototype.foo = function() {
  // you can use C.PRIVATE
  // or this.C.PUBLIC
};

/** Put most of my comments outside the functions... */
WINDSENSOR.prototype.bar = function() {
};

/* ---------------------------------- above not that relevant ;p ---------------------------------- */

var WINDSENSOR = {};
// pins
//var analogPinForOut = undefined; // not used for now ..
//var analogPinForRV = undefined;
//var analogPinForTMP = undefined;
var analogPinForRV = A1; // R: through a level shifter as only 3.3V tolerant
var analogPinForTMP = A0; // R: through a level shifter as only 3.3V tolerant
// vars
var zeroWindAdjustment =  0.2; // (float)

var TMP_Therm_ADunits;  //temp termistor value from wind sensor (int)
var RV_Wind_ADunits;    //RV output from wind sensor (float)
var RV_Wind_Volts;      // (float)
var lastMillis;         // (unsigned long )
var TempCtimes100;      // (int)
var zeroWind_ADunits;   // (float)
var zeroWind_volts;     // (float)
var WindSpeed_MPH;      // (float)

// callback
WINDSENSOR.updateHandler = undefined;

// config
WINDSENSOR.updateIntervalTime = 200; // read every 200ms
WINDSENSOR.updateInterval = undefined; // reference to the interval itself

// does nothing for the moment ;p
WINDSENSOR.init = function(callback){
  callback(null);
};

// register a handler to get updates on the sensor values
WINDSENSOR.registerHandler = function(updateHandler){
  if(updateHandler) WINDSENSOR.updateHandler = updateHandler;
};

// start the readings
WINDSENSOR.startSensorReadings = function(){
  WINDSENSOR.updateInterval = setInterval(function(){
    // TODO: read stuff from sensor
    WINDSENSOR.getSensorReadings(function(sensorReadings){
      // TODO: callback handler with computed stuff
      if(WINDSENSOR.updateHandler !== undefined) WINDSENSOR.updateHandler(sensorReadings);
      else console.log('sensorReadings: ' + sensorReadings);
    });
  }, WINDSENSOR.updateIntervalTime);
};
// stop the readings
WINDSENSOR.stopSensorReadings = function(){
  if(WINDSENSOR.updateInterval !== undefined) clearInterval(WINDSENSOR.updateInterval);
  WINDSENSOR.updateInterval = undefined;
};

// read stuff from the sensor & compute stuff out from those readings
WINDSENSOR.getSensorReadings = function(callback){
  TMP_Therm_ADunits = analogRead(analogPinForTMP);
  RV_Wind_ADunits = analogRead(analogPinForRV);
  RV_Wind_Volts = (RV_Wind_ADunits *  0.0048828125);

  // these are all derived from regressions from raw data as such they depend on a lot of experimental factors
  // such as accuracy of temp sensors, and voltage at the actual wind sensor, (wire losses) which were unaccouted for.
  TempCtimes100 = (0.005 *(TMP_Therm_ADunits * TMP_Therm_ADunits)) - (16.862 * TMP_Therm_ADunits) + 9075.4;  

  zeroWind_ADunits = -0.0006*(TMP_Therm_ADunits * TMP_Therm_ADunits) + 1.0727 * TMP_Therm_ADunits + 47.172;  //  13.0C  553  482.39

  zeroWind_volts = (zeroWind_ADunits * 0.0048828125) - zeroWindAdjustment;

  // This from a regression from data in the form of 
  // Vraw = V0 + b * WindSpeed ^ c
  // V0 is zero wind at a particular temperature
  // The constants b and c were determined by some Excel wrangling with the solver.

  WindSpeed_MPH = Math.pow(((RV_Wind_Volts - zeroWind_volts) /0.2300) , 2.7265); // NaN ? :/ ..

  console.log("  TMP volts ");
  console.log(TMP_Therm_ADunits * 0.0048828125);

  console.log(" RV volts ");
  console.log(RV_Wind_Volts);

  console.log("\t  TempC*100 ");
  console.log(TempCtimes100 );

  console.log("   ZeroWind volts ");
  console.log(zeroWind_volts);

  console.log("   WindSpeed MPH ");
  console.log(WindSpeed_MPH);

  var sensorReadings = {
    tmpVolts: TMP_Therm_ADunits * 0.0048828125,
    rvVolts: RV_Wind_Volts,
    tempCtimes100: TempCtimes100,
    zeroWindVolts: zeroWind_volts,
    windSpeedMPH: WindSpeed_MPH
  };

  if (callback) callback(sensorReadings);
  else return sensorReadings;
};



/** This is 'exported' so it can be used with `require('MOD123.js').connect(pin1,pin2)` */
exports.connect = function (outInputPin, RvInputPin, TmpInputPin, connectedCallback) {
  if(connectedCallback) connectedCallback(WINDSENSOR);
  return WINDSENSOR;
};



// == test code for module check ==
// dummy external vars for now ..
var outInputPin = undefined;
var RvInputPin = A1;
var TmpInputPin = A0;
    
//var windSensor = require('WindSensor').connect(outInputPin, RvInputPin, TmpInputPin, function(err){
var windSensor = exports.connect(outInputPin, RvInputPin, TmpInputPin, function(err){
  if(!err){
    // register callback handler
    windSensor.registerHandler(function(sensorReadings){
      // here, do stuff with Out, Rv & Temp
      console.log(sensorReadings);
    });
  } else {
    console.log(err);
  }
});
