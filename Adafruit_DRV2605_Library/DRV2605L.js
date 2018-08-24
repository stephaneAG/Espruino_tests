
/* Copyright (c) 2018 Stéphane Adam Garnier. See the file LICENSE for copying permission. */
/*

----> https://github.com/adafruit/Adafruit_DRV2605_Library
----> http://www.adafruit.com/products/2305

Module for the Adafruit DRV2605L Haptic Driver IC.
Only I2C is supported.

Parts of the module is based on the driver written by Limor Fried/Ladyada for Adafruit Industries:
MIT license, all text above must be included in any redistribution
I2Cdev device library code is placed under the MIT license

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
*/


```
/* ==== example code - basic - ==== */
var i2c = I2C1; // hardware I2C on supported pins
//var i2c = new I2C(); // software I2C on any pin
i2c.setup({ scl : B6, sda: B7 });
var drv = require("DRV2605").connect(i2c);
Serial.println("DRV test");
drv.begin();
drv.selectLibrary(1);

// I2C trigger by sending 'go' command
// default, internal trigger when sending GO command
drv.setMode(DRV2605.MODE_INTTRIG);
var effect = 1; // uint8_t
effect = 0; // quick hack to have a tinier loop ;)
var timer = setTimeout(function(){
  effect++;
  if (effect > 117) effect = 1;
  Serial.print("Effect #"); Serial.println(effect);
  // set the effect to play
  drv.setWaveform(0, effect);  // play effect
  drv.setWaveform(1, 0);       // end waveform
  // play the effect!
  drv.go();
}, 500); // wait a bit
```

/* Module constants*/
var C = {
  ADDR:              0x5A,

  MODE_INTTRIG:      0x00,
  MODE_EXTTRIGEDGE:  0x01,
  MODE_EXTTRIGLVL:   0x02,
  MODE_PWMANALOG:    0x03,
  MODE_AUDIOVIBE:    0x04,
  MODE_REALTIME:     0x05,
  MODE_DIAGNOS:      0x06,
  MODE_AUTOCAL:      0x07,
};

/* Register addresses*/
var R = {
  REG_STATUS:        0x00,
  REG_MODE:          0x01,

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
};

exports.DRV2605 = C;

exports.connect = function (_i2c,_addr) {
  return new DRV2605(_i2c,_addr);
};

/* MPU6050 Object - not yet sure about the _addr part, so for now, it'll stay as is whatever arg passed => TODO: digg the datasheet ! */
function DRV2605(_i2c, _addr) {
  this.i2c = _i2c;
  this.addr =
    (undefined===_addr || false===_addr) ? C.ADDR : //C.ADDRESS_AD0_LOW :
    (true===_addr) ? C.ADDR : //C.ADDRESS_AD0_HIGH :
    _addr;
  this.initialize();
}


/* Initialize the chip */
DRV2605.prototype.initialize = function() {
  //this.begin();
};

/* () -> boolean */
DRV2605.prototype.begin = function(){
  //Wire.begin();
  var id = this.readRegister8(R.REG_STATUS); //uint8_t id = this.readRegister8(C.REG_STATUS);
  //Serial.print("Status 0x"); Serial.println(id, HEX);

  this.writeRegister8(R.REG_MODE, 0x00); // out of standby

  this.writeRegister8(R.REG_RTPIN, 0x00); // no real-time-playback

  this.writeRegister8(R.REG_WAVESEQ1, 1); // strong click
  this.writeRegister8(R.REG_WAVESEQ2, 0);

  this.writeRegister8(R.REG_OVERDRIVE, 0); // no overdrive

  this.writeRegister8(R.REG_SUSTAINPOS, 0);
  this.writeRegister8(R.REG_SUSTAINNEG, 0);
  this.writeRegister8(R.REG_BREAK, 0);
  this.writeRegister8(R.REG_AUDIOMAX, 0x64);

  // ERM open loop

  // turn off N_ERM_LRA
  this.writeRegister8(R.REG_FEEDBACK, this.readRegister8(R.REG_FEEDBACK) & 0x7F);
  // turn on ERM_OPEN_LOOP
  this.writeRegister8(R.REG_CONTROL3, this.readRegister8(R.REG_CONTROL3) | 0x20);

  return true;

};

/* (uint8_t reg, uint8_t val); -> void */
DRV2605.prototype.writeRegister8(reg, val){
  // use i2c
  //Wire.beginTransmission(DRV2605.ADDR);
  this.i2c.writeTo(this.addr, reg); // Wire.write((byte)reg)
  this.i2c.writeTo(this.addr, val); // Wire.write((byte)val);
  //Wire.endTransmission();
};

/* (uint8_t reg) -> uint8_t */
DRV2605.prototype.readRegister8 = function(reg){
  //var x; // uint8_t

  // use i2c
  //Wire.beginTransmission(DRV2605.ADDR);
  this.i2c.writeTo(this.addr, reg); // Wire.write((byte)reg);
  //Wire.endTransmission();
  var x = this.i2c.readFrom(this.addr, 1); //Wire.requestFrom((byte)DRV2605.ADDR, (byte)1); /*--*/ x = Wire.read();

  //  Serial.print("$"); Serial.print(reg, HEX);
  //  Serial.print(": 0x"); Serial.println(x, HEX);

  return x;

};

/* (uint8_t slot, uint8_t w) -> void */
DRV2605.prototype.setWaveform = function(slot, w){
  this.writeRegister8(R.REG_WAVESEQ1+slot, w);
};

/* (uint8_t lib) -> void */
DRV2605.prototype.selectLibrary = function(lib){
  this.writeRegister8(R.REG_LIBRARY, lib);
};

/* () -> void */
DRV2605.prototype.go = function(){
  this.writeRegister8(R.REG_GO, 1);
};

/* () -> void */
DRV2605.prototype.stop = function(){
  this.writeRegister8(R.REG_GO, 0);
};

/* (uint8_t mode) -> void */
DRV2605.prototype.setMode = function(mode){
  this.writeRegister8(R.REG_MODE, mode);
};

/* (uint8_t rtp) -> void */
DRV2605.prototype.setRealtimeValue = function(rtp){
  this.writeRegister8(R.REG_RTPIN, rtp);
};


// Select ERM (Eccentric Rotating Mass) or LRA (Linear Resonant Actuator) vibration motor
// The default is ERM, which is more common

/* () -> void */
DRV2605.prototype.useERM = function(){
  this.writeRegister8(R.REG_FEEDBACK, this.readRegister8(R.REG_FEEDBACK) & 0x7F);
};

/* () -> void */
DRV2605.prototype.useLRA = function(){
  this.writeRegister8(R.REG_FEEDBACK, this.readRegister8(R.REG_FEEDBACK) | 0x80);
};
