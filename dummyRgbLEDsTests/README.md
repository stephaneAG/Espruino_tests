###### common cathode RGB LED
![alt rgb led diagram](https://raw.githubusercontent.com/stephaneAG/Espruino_tests/master/dummyRgbLEDsTests/rgb_led_diagram.jpg)

###### components & connections
- 1 x RGB LED common cathode ( or common anode - just remember to tweak the code )
- 2 x 220 Ohm resistors ( Green & Blue channels)
- 1 x 1k resistor ( Red channel )  

The connections goes as follow: 
- Espruino B9 --/\/\/-- R
- Espruino B4 --/\/\/-- G
- Espruino B8 --/\/\/-- B
- Espruino B9 --------- Common cathode Gnd

###### basic colors
- red    => R
- yellow => R + G
- green  => G
- aqua   => G + B
- blue   => B
- purple => B + R
- white  => R + G + B


###### functions yet to be implemented:
- setColor ( r, g, b ) // & related var to handle common anode LEDs
- circleToColor(targetColor, CWorCCW) // fade through colors to target ex: (CW) red > purple > blue > aqua > green > yellow
- toColor( .. ) // fade to color - fading version of 'setColor()'
- centerToColor( .. ) - fade to white then to color 
