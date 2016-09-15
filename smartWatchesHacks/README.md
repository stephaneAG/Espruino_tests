R: the following models were found in the same type of cheap smartwatches:
nRF51822 - same as Puck.js
CC2541
DA14280
DA14580
RDA5871

Topic on the Espruino forums: Espruino on your watch !
http://forum.espruino.com/conversations/280747/

Topic on the Espruino forums: Testing Puck.js on the nRF52 Dev Kit
http://forum.espruino.com/conversations/291522/#comment13166145

some nRF52 related stuff
https://www.tindie.com/products/onehorse/nrf52832-development-board/
https://developer.mbed.org/questions/68359/NRF52-Support/
https://devzone.nordicsemi.com/tutorials/7/
https://devzone.nordicsemi.com/question/72675/nrf52-dk-flashing-with-jlink-in-ubuntu/
https://github.com/contiki-os/contiki/tree/master/platform/nrf52dk


#### flash & program the "iDO / DO 003" smartwatch ( extracted from the Espruino forums: http://forum.espruino.com/conversations/280747/ ):
3 wires for SWD ( DIA, CLK & GND )
appears as a BLE UART device
was programmed using OpenOCD 
used an STM32F4Discovery board. You just pull 2 jumpers off, then it's 2 wires and ground
strongly suggest buying an nRF51 devkit though - it'll make it much easier to flash the firmware onto the watch (and to read the original firmware first, so you can restore it later if you want to!).
nRF52 DK then you get the new nRF52 chip in it as well, and can play around with the code that'll run on Puck.js too.
flashing is way easier too. You just wire the board up to a 0.1" header, and then it appears as a USB flash drive and you just copy the hex file over to that drive

OpenOCD seems a bit crazy though - I ended up trying to dig the relevant command-line out of Adafruit's tools.

connect to the GND, DIA and CLK pads, then you can use a 'normal' SWD programmer. Any STM32Discovery kit will work, and then you can use the following script with OpenOCD ( https://github.com/espruino/Espruino/blob/master/scripts/flash_nrf51_openocd.sh )
```
#!/bin/bash

if [ $# -ne 1 ]
then
  echo "USAGE:"
  echo "scripts/flash_nrf51_openocd.sh espruino_XXXX.hex"
  exit 1
fi

FIRMWARE=$1
# must be hex file

OPENOCD=`dirname $0`/../openocd-0.9.0
# OpenOCD from https://github.com/adafruit/Adafruit_nRF51822_Flasher
$OPENOCD/ubuntu/openocd -s $OPENOCD/scripts -f interface/stlink-v2.cfg -f target/nrf51.cfg -c init -c "reset init" -c halt -c "nrf51 mass_erase" -c "program $FIRMWARE verify" -c reset -c exit
```


Name |	Pins |	Notes
| --- | --- | --- |
RX pad |	P0.17 | ?	
TX pad |	P0.18	
CLK pad	| SWDIO	
DIA pad	| SWDCLK	
32k osc?	| P0.26, P0-27 |	Not fitted
Vibrate |	P0.07	| via some FET/transistor
Button |	P0.04 |	Needs input_pullup
Accelerometer |	P0.10-16? |	Kionix kx022-1020
P0.16 |	clk
P0.15 |	short pulses? irq?
P0.14 |	data
OLED |	|	SSD1306 64x32
P0.29 |	MOSI
P0.30 |	SCK
P0.0 |	DC
P0.1 |	RST
P0.2 |	CS

Test code:
```javascript
var BTN = D4; pinMode(BTN,"input_pullup");
var initCmds = new Uint8Array([ 
  0xAe,
  0xD5, 
  0x80, 
  0xA8, 31,
  0xD3,0x0,
  0x40,
  0x8D, 0x14, 
  0x20,0x0, 
  0xA1,
  0xC8,
  0xDA, 0x12,
  0x81, 0xCF,
  0xD9, 0xF1,
  0xDb, 0x40,
  0xA4,
  0xA6,
  0xAf 
]);
var flipCmds = [
     0x21,
     0, 63,
     0x22,
     0, 7];
var dc = D0;
var rst = D1;
var cs = D2;
var g = Graphics.createArrayBuffer(63,31,1,{vert­ical_byte : true});
var spi = new SPI();
spi.setup({mosi: 29 /* D1 */, sck:30 /* D0 */});
digitalPulse(rst,0,10);
setTimeout(function() {
  digitalWrite(cs,0);
  digitalWrite(dc,0); // command
  spi.write(initCmds);
  digitalWrite(dc,1); // data
  digitalWrite(cs,10);
}, 50);
g.flip = function() { 
cs.reset();dc.reset();
spi.write([0x21,0,127,0x22,0,7]);
for (var i=0;i<4;i++) {
  spi.write(0xb0+i,0x00,0x12);
  dc.set();
  spi.write(Uint8Array(this.buffer,64*i,64­));
  dc.reset();
}cs.set();
};
//function cmd(c){cs.reset();dc.reset();spi.write(c­);cs.set();}
//function dispoff(){cmd(0xae);}
//function dispon(){cmd(0xaf);}
 g.drawString("Hello",0,0);
 g.drawString("ESPRUINO",10,10);
 g.flip();
```

Latest firmware
```javascript
var initCmds = new Uint8Array([ 
0xAe,0xD5, 0x80, 0xA8, 31,0xD3,0x0,
0x40,0x8D,0x14,0x20,0x01, 0xA1,
0xC8,0xDA,0x12,0x81,0xCF,
0xD9,0xF1,0xDb,0x40,0xA4,
0xA6,0xAf ]);
var dc = D0;
var cs = D2;
var g = Graphics.createArrayBuffer(63,15,1,{vert­ical_byte : true});
var spi = new SPI();
spi.setup({mosi: 29 /* D1 */, sck:30 /* D0 */});
digitalPulse(D1,0,10);//rst
cs.reset();dc.reset();spi.write(initCmds­);delete initCmds;cs.set();
g.flip = function() { cs.reset();dc.reset();spi.write([0x21,0,­127,0x22,0,7]);for (var i=0;i<4;i++) {spi.write(0xb0+i,0x00,0x12);dc.set();sp­i.write(Uint8Array(this.buffer,64*i,64))­;dc.reset();}cs.set();};
var n=0;
function onSec() {
var d=new Date();g.clear();g.drawString(d.getHours­()+":"+d.getMinutes()+"."+d.getSeconds()­);g.flip();if (n++>10) {spi.write(0xae,cs);clearInterval();}
}
pinMode(D4,"input_pullup");
setWatch("clearInterval();setInterval(on­Sec,1000);n=0;spi.write(0xaf,cs);",D4,{e­dge:"falling",repeat:true});
```
