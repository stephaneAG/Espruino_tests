/*************************************************** 
  Espruino Port of the library for the Adafruit DRV2605L Haptic Driver
  ----> https://github.com/adafruit/Adafruit_DRV2605_Library
  ----> http://www.adafruit.com/products/2305
  Original code by
  Written by Limor Fried/Ladyada for Adafruit Industries.
  MIT license, all text above must be included in any redistribution
  
  --------
  
  code untested yet ;)
  Port by StephaneAG - 2018
 ****************************************************/



//var Wire  = require('wire');
var DRV2605 = {
  ADDR:              0x5A,
  REG_STATUS:        0x00,
  REG_MODE:          0x01,
  MODE_INTTRIG:      0x00,
  MODE_EXTTRIGEDGE:  0x01,
  MODE_EXTTRIGLVL:   0x02,
  MODE_PWMANALOG:    0x03,
  MODE_AUDIOVIBE:    0x04,
  MODE_REALTIME:     0x05,
  MODE_DIAGNOS:      0x06,
  MODE_AUTOCAL:      0x07,

  REG_RTPIN:         0x02,
  REG_LIBRARY:       0x03,
  REG_WAVESEQ1:      0x04,
  REG_WAVESEQ2:      0x05,
  REG_WAVESEQ3:      0x06,
  REG_WAVESEQ4:      0x07,
  REG_WAVESEQ5:      0x08,
  REG_WAVESEQ6:      0x09,
  REG_WAVESEQ7:      0x0A,
  REG_WAVESEQ8:      0x0B,

  REG_GO:            0x0C,
  REG_OVERDRIVE:     0x0D,
  REG_SUSTAINPOS:    0x0E,
  REG_SUSTAINNEG:    0x0F,
  REG_BREAK:         0x10,
  REG_AUDIOCTRL:     0x11,
  REG_AUDIOLVL:      0x12,
  REG_AUDIOMAX:      0x13,
  REG_RATEDV:        0x16,
  REG_CLAMPV:        0x17,
  REG_AUTOCALCOMP:   0x18,
  REG_AUTOCALEMP:    0x19,
  REG_FEEDBACK:      0x1A,
  REG_CONTROL1:      0x1B,
  REG_CONTROL2:      0x1C,
  REG_CONTROL3:      0x1D,
  REG_CONTROL4:      0x1E,
  REG_VBAT:          0x21,
  REG_LRARESON:      0x22
}

var i2c = undefined;

exports.DRV2605 = DRV2605;

//Adafruit_DRV2605(void); // constructor
exports.connect = function(){
  i2c = I2C1; // hardware I2C on supported pins
  //i2c = new I2C(); // software I2C on any pin
  i2c.setup({ scl : B6, sda: B7 });  
};
  
exports.begin = function(){
  //Wire.begin();
  uint8_t id = exports.readRegister8(DRV2605.REG_STATUS);
  //Serial.print("Status 0x"); Serial.println(id, HEX);
  
  exports.writeRegister8(DRV2605.REG_MODE, 0x00); // out of standby
  
  exports.writeRegister8(DRV2605.REG_RTPIN, 0x00); // no real-time-playback
  
  exports.writeRegister8(DRV2605.REG_WAVESEQ1, 1); // strong click
  exports.writeRegister8(DRV2605.REG_WAVESEQ2, 0);
  
  exports.writeRegister8(DRV2605.REG_OVERDRIVE, 0); // no overdrive
  
  exports.writeRegister8(DRV2605.REG_SUSTAINPOS, 0);
  exports.writeRegister8(DRV2605.REG_SUSTAINNEG, 0);
  exports.writeRegister8(DRV2605.REG_BREAK, 0);
  exports.writeRegister8(DRV2605.REG_AUDIOMAX, 0x64);
    
  // ERM open loop
  
  // turn off N_ERM_LRA
  exports.writeRegister8(DRV2605.REG_FEEDBACK, readRegister8(DRV2605.REG_FEEDBACK) & 0x7F);
  // turn on ERM_OPEN_LOOP
  exports.writeRegister8(DRV2605.REG_CONTROL3, readRegister8(DRV2605.REG_CONTROL3) | 0x20);

  return true;
    
}; // () -> boolean

exports.writeRegister8(reg, val){
  // use i2c
  //Wire.beginTransmission(DRV2605.ADDR);
  i2c.writeTo(DRV2605.ADDR, reg); // Wire.write((byte)reg)
  i2c.writeTo(DRV2605.ADDR, val); // Wire.write((byte)val);
  //Wire.endTransmission();
}; // (uint8_t reg, uint8_t val); -> void
  
exports.readRegister8 = function(reg){
  var x; // uint8_t
  
  // use i2c
  //Wire.beginTransmission(DRV2605.ADDR);
  i2c.writeTo(DRV2605.ADDR, reg); // Wire.write((byte)reg);
  //Wire.endTransmission();
  var x = i2c.readFrom(DRV2605.ADDR, 1); //Wire.requestFrom((byte)DRV2605.ADDR, (byte)1); /*--*/ x = Wire.read();

  //  Serial.print("$"); Serial.print(reg, HEX); 
  //  Serial.print(": 0x"); Serial.println(x, HEX);
  
  return x;
    
}; // (uint8_t reg) -> uint8_t
  
exports.setWaveform = function(slot, w){
  exports.writeRegister8(DRV2605.REG_WAVESEQ1+slot, w);
}; // (uint8_t slot, uint8_t w) -> void
  
exports.selectLibrary = function(lib){
  exports.writeRegister8(DRV2605.REG_LIBRARY, lib);
}; // (uint8_t lib) -> void
  
exports.go = function(){
  exports.writeRegister8(DRV2605.REG_GO, 1);
}; // () -> void
  
exports.stop = function(){
  exports.writeRegister8(DRV2605.REG_GO, 0);
}; // () -> void
  
exports.setMode = function(mode){
  exports.writeRegister8(DRV2605.REG_MODE, mode);
}; // (uint8_t mode) -> void
  
exports.setRealtimeValue = function(rtp){
  exports.writeRegister8(DRV2605.REG_RTPIN, rtp);
}; // (uint8_t rtp) -> void
  
  
// Select ERM (Eccentric Rotating Mass) or LRA (Linear Resonant Actuator) vibration motor
// The default is ERM, which is more common
  
exports.useERM = function(){
  exports.writeRegister8(DRV2605.REG_FEEDBACK, exports.readRegister8(DRV2605.REG_FEEDBACK) & 0x7F);
}; // () -> void
  
exports.useLRA = function(){
  exports.writeRegister8(DRV2605.REG_FEEDBACK, exports.readRegister8(DRV2605.REG_FEEDBACK) | 0x80);
};  // () -> void
