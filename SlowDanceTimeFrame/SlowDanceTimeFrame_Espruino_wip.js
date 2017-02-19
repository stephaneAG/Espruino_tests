/* -----------------------------------------------------------------------------
// TimeFrame_Espruino V0.1a - adapted by StephaneAG  - 2017
// -> thx to the original authors => support them ;)

// -----------------------------------------------------------------------------

// TimeFrame V3.1 - simple version
// Copyright (C) 2016 Cubc-Print

// get the latest source core here: http://www.github.com/cubic-print/timeframe
// video: http://youtu.be/LlGywKkifcI
// order your DIY kit here: http://www.cubic-print.com/TimeFrame

//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    GNU General Public License terms: <http://www.gnu.org/licenses/>.

----------------------------------------------------------------------------- */

// Helper ( Espruino's 'analogRead()' ranges [0..1] whereas Arduino's ranges [0..1023] )
var map = function(val, fromMin, fromMax, toMin, toMax){
  return (val - fromMin) * (toMax - toMin) / (fromMax - fromMin) + toMin;
}


// var debug = 1;
//uncomment to check serial monitor and see LED heartbeat
//Tactile Switch needs to be pressed longer in debug mode to change mode

//Base frequency and trimmer Ranges
var baseFreq = 80.0; //80 in on the spot for many flowers. Feel free to play with this +/-5Hz
var phaseShiftMin = 0.1;
var phaseShiftMax = 5.0;
var brightnessMin = 2;  //if too low the movement will be only visible in darker rooms
var brightnessMax = 10.0; //with high settings flickering will occur

var speedControlPin = A1; // NOTE: to change for one of Espruino pins
var brightnessControlPin = A0; // NOTE: to change for one of Espruino pins
var ledPin = 13; //on board LED // NOTE: to change for one of Espruino pins
var modeSelectPin = 6; // "SW" button for mode selection // NOTE: to change for one of Espruino pins
var modeChanged = 1; // NOTE: currently not used
var mode = 1; //toggled by modeSelectPin ( "SW" ) button
  //mode 1 = normal slow motion mode (power on)
  //mode 2 = distorted reality mode
  //mode 3 = magnet off
  //mode 4 = completely off

var phaseShift = 0.1; // ex: f=0.5 -> T=2 -> 2 seconds per slow motion cycle

//Timer 2 for Magnet
//Prescaler = 1024 = CS111 = 64us/tick
//PIN 3
var magPin = 3; // NOTE: to change for one of Espruino pins
var magDuty = 15; // R: "8" in "simple" version //12 be carefull not overheat the magnet. better adjust force through magnet position
var magFrequency = baseFreq;
var magTime = Math.round(16000000/1024/magFrequency); // NOTE: currently not used

//Timer 1 for LED
//Prescaler = 8 = CS010 = 0.5 us/tick
//PIN 10
var lightPin = 10; // NOTE: to change for one of Espruino pins
var ledDuty = 7; // R: "20" in "simple" version
var ledFrequency = magFrequency + phaseShift;
var ledTime = Math.round(16000000/8/ledFrequency); // NOTE: currently not used

var setup = function () {
  //Serial1.setup(9600/*baud*/);

  pinMode(ledPin , 'output'); //Heart Beat LED
  pinMode(modeSelectPin, 'input'); //button pin
  pinMode(magPin, 'output');  //MAG: Timer 2B cycle output
  pinMode(lightPin, 'output'); //LED: Timer 1B cycle output

  if(debug){ // NOTE: currently not used
    //pinMode(11, 'output'); //Timer 2A half frequency at 50% duty output for debugging halbe frequenz! 50% duty
    //pinMode(9, 'output');  //Timer 1A half frequency at 50% duty output for debugging
    // TODO: implm serial logs & onboard led heartbeat
  }

  // init electromagnet & strobe light
  magOn();
  lightOn();

  // init mode, speed & brightness adjustements
  setWatch(adjustMode, modeSelectPin, { repeat: true, edge: 'rising', debounce: 50 });
  setWatch(adjustSpeed, speedControlPin, { repeat: true, debounce: 50 });
  setWatch(adjustBrightness, brightnessControlPin, { repeat: true, debounce: 50 });
}

var magOn = function(){ analogWrite(magPin, 1, {freq:magFrequency}); };
var magOff = function(){ digitalWrite(magPin, 0); };
var lightOn = function(){ analogWrite(lightPin, 1, {freq:ledFrequency}); };
var lightOff = function(){ digitalWrite(lightPin, 0); };

var adjustMode = function(){
  mode += 1;
  if (mode >= 5) mode = 1; //rotary menu
  //mode_changed = 1;
  switch (mode) {
    case mode === 1:
      magFrequency = baseFreq;
      magOn();
      lightOn();
      break;
    case mode === 2:
      // "frequency doubleing already done in main loop" ( comment from original author ) -> meaning ?
      break;
    case mode === 3:
      magOff();
      break;
    case mode === 4:
      lightOff();
      break;
  }
}

// R: in '1023L' the 'L' stands for 'Long'
var adjustSpeed = function(){
  //phaseShift = -( phaseShiftMax - phaseShiftMin ) / 1023 * analogRead(speedControlPin) + phaseShiftMax; //Speed: 0.1 .. 5 Hz
  phaseShift = -( phaseShiftMax - phaseShiftMin ) / 1023 * map( analogRead(speedControlPin), 0, 1, 0, 1023 ) + phaseShiftMax; //Speed: 0.1 .. 5 Hz
  analogWrite(lightPin, 1, {freq:ledFrequency}); // update the strobes
}

var adjustBrightness = function(){
  //ledDuty = -( brightnessMax - brightnessMin ) / 1023 * analogRead(brightnessControlPin) + brightnessMax;  //Brightness: duty_led 2..20
  ledDuty = -( brightnessMax - brightnessMin ) / 1023 * map( analogRead(brightnessControlPin), 0, 1, 0, 1023 ) + brightnessMax;  //Brightness: duty_led 2..20
  ledFrequency = magFrequency * mode + phaseShift;
  analogWrite(lightPin, 1, {freq:ledFrequency}); // update the strobes
}

/*

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  pinMode(LED, OUTPUT); //Heart Beat LED
  pinMode(SW, INPUT); //button pin
  pinMode(3, OUTPUT); //MAG: Timer 2B cycle output
  pinMode(10, OUTPUT); //LED: Timer 1B cycle output

  #ifdef DEBUG
    pinMode(11, OUTPUT); //Timer 2A half frequency at 50% duty output for debugging halbe frequenz! 50% duty
    pinMode(9, OUTPUT); //Timer 1A half frequency at 50% duty output for debuggin
  #endif

  mag_on();
  OCR2A = round(time_mag); //Hierraus frequenz output compare registers
  OCR2B = round(duty_mag*time_mag/100L); //hierraus frequency output compare registers
  led_on();
  OCR1A = round(time_led); //Hierraus frequenz output compare registers
  OCR1B = round(duty_led*time_led/100L); //hierraus frequency output compare registers

  sei();
}

void loop() {
  //Read in trimmer settings
  phase_shift = -(MAX_PHASE_SHIFT-MIN_PHASE_SHIFT)/1023L*analogRead(A1)+MAX_PHASE_SHIFT; //Speed: 0.1 .. 5 Hz
  delay(3);
  duty_led = -(MAX_BRIGHTNESS-MIN_BRIGHTNESS)/1023L*analogRead(A0)+MAX_BRIGHTNESS;  //Brightness: duty_led 2..20
  frequency_led = frequency_mag*mode+phase_shift;

  if ((mode == 1) && (mode_changed == 1))
  {
    frequency_mag = BASE_FREQ;
    mag_on();
    led_on();
    mode_changed = 0;
  }//mode = 1
  if ((mode == 2) && (mode_changed == 1))
  {
    //frequency doubleing already done in main loop
    mode_changed = 0;
  }//mode = 2
  if ((mode == 3) && (mode_changed == 1))
  {
    mag_off(); //mode = 2
    mode_changed = 0;
  }//mode = 3
  if ((mode == 4) && (mode_changed == 1))
  {
    led_off(); //mode = 4
    mode_changed = 0;
  }//mode = 4

  time_mag = round(16000000L/1024L/frequency_mag);
  time_led = round(16000000L/8L/frequency_led);

  OCR2A = round(time_mag); //to calculate frequency of output compare registers
  OCR2B = round(duty_mag*time_mag/100L);
  OCR1A = round(time_led);
  OCR1B = round(duty_led*time_led/100L);

  if (digitalRead(SW) == HIGH) //Read in switch
  {
    mode += 1;
    if (mode >= 5) mode = 1; //rotary menu
    delay(400); //400ms debounce
    mode_changed = 1;
  }

#ifdef DEBUG
 //Heatbeat on-board LED
  digitalWrite(LED, HIGH); // LED on
  delay(300);
  digitalWrite(LED, LOW); // LED off
  delay(300);
  digitalWrite(LED, HIGH); // LED on
  delay(200);
  digitalWrite(LED, LOW); // LED off
  delay(1200);
  //serial print current parameters
  Serial.print("Phase Shift: "); //speed of animation
  Serial.print(phase_shift);
  Serial.print("  Force: ");
  Serial.print(duty_mag);
  Serial.print("  Freq: ");
  Serial.print(frequency_mag);
  Serial.print("  Brightness: ");
  Serial.println(duty_led);
#endif
} //main loop

void mag_on() {
  TCCR2A = 0;
  TCCR2B = 0;
  TCCR2A = _BV(COM2A0) | _BV(COM2B1) | _BV(WGM21) | _BV(WGM20);
  TCCR2B = _BV(WGM22) | _BV(CS22)| _BV(CS21)| _BV(CS20);
}

void mag_off() {
  TCCR2A = 0;
  TCCR2B = 0;
  TCCR2A = _BV(COM2A0) | _BV(COM2B1);
  TCCR2B = _BV(CS22)| _BV(CS21)| _BV(CS20);
}

void led_on() {
TCCR1A = 0;
  TCCR1B = 0;
  TCCR1A = _BV(COM1A0) | _BV(COM1B1) | _BV(WGM11) | _BV(WGM10);
  TCCR1B =  _BV(WGM13) | _BV(WGM12)  |  _BV(CS11);
}

void led_off() {
  TCCR1A = 0;
  TCCR1B = 0;
  TCCR1A = _BV(COM1A0) | _BV(COM1B1);
  TCCR1B =  _BV(CS11);
}

*/
