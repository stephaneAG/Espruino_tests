## little library to get readings from a ModernDevices WindSensor Rec C

from the original Arduino code by Paul Badger - 2014
adapted by StephaneAG - 2018

#### usage on Espruino boards

```javascript
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

#### links to the product ( :) )

- https://moderndevice.com/product/wind-sensor/
- https://moderndevice.com/news/wind-sensor-calibration/

#### links to the available libraries to interface it
- https://github.com/moderndevice/Wind_Sensor/blob/master/WindSensor/WindSensor.ino
