/* 
  R: the following code is to be used with the fresh SVG of the Pico ;P 
  
  TODO:
  - write "board" js obj ( re-check "HackedCNCSVG" ? ^^ )
  - write fcns to populate a "board" obj from a loaded/selected SVG ( which 'd have been ~correctly written )
  - write mimicking fcns for "digital/analogWrite()" & "digital/analogRead()" depending on the type of stuff passed as arg
    (  if a btn / led / pin, & if a pin what does it support & what is it connected to, .. )
  - write handlers for the above mimicking fcns that 'd change the SVG's LED's color ( state ) or trigger a "btn press" event

*/

// load/select a board/SVG ( here, I'm just poking around with the SVG loaded directly in a browser tab )

// get a ref to the SVG ( we're looking for 'BOARD__<board name>' stuff, and Illustrator replaces '__' by '_x5F__x5F_' )
var boardSVG = document.querySelector('[id*="BOARD_"]')

// get the name of the board from the ref we have to the SVG
var boardName = boardSVG.id.substr( boardSVG.id.indexOf('_x5F__x5F_')+'_x5F__x5F_'.length )
//>"EspruinoPico"

// TODO: camelCaseExceptFirst to Spaced Caps the board name

// get the board pins
var boardPins = boardSVG.querySelectorAll('[id*="PIN_"]')
//> too much stuff here ;p
boardPins.length
//> 33 -> all right !

// get the board LEDs
var boardLeds = boardSVG.querySelectorAll('[id*="ledBulb"]')
boardLeds.length
//> 2 -> good to go !
// get the LEDs default color ( in other words, how gray-ish these are when off )
var ledsDefaultColor = boardLeds[0].getAttribute('fill')
ledsDefaultColor
//> "#BEC1C0"
// quickie: turn on the LED1 & LED2 ( change their color to respectively red & green )
boardLeds[1].setAttribute('fill', '#CC0512') // LED1
boardLeds[0].setAttribute('fill', '#42B205'); // LED2


// get the board buttons
var boardButtons = boardSVG.querySelectorAll('[id*="btnToggle"]')
boardButtons.length
//> 1 -> sweet !
// get the BTN press event ( to do more advanced stuff, we'd use mouseup & mouseown ( .. ) )
boardButtons[0].addEventListener('click', function(e){
  console.log('BTN clicked !');
})

// digg & add 'glowing/pulsing' color

// quickies to do: on BTN mousedown, translate its shadow back to base of button, while translating both downward
//                 on BTN mouseup, revert the above movement

// somewhere to save the code that'll be executed ( no E.on('init', fcn(){ .. }) - a no need to 'save' ;p )

// some test code that makes use of the above to toggle the onboard LEDs based on presses on BTN



// ex: click to toggle on/off an oscillator that light red & green LEDs alternatively
// init the LEDs to off
ledsDefaultColor = '#BEC1C0'
boardLeds[1].setAttribute('fill', ledsDefaultColor )
boardLeds[0].setAttribute('fill', ledsDefaultColor )

// helper vars
var ledToggling = false; // oscillate LEDs or not
var ledToggleT = undefined; // timeout

// function that toggles the LEDs on & off
function toggleLEDs(){
  if( boardLeds[1].getAttribute('fill' ) === ledsDefaultColor ) {
    boardLeds[1].setAttribute('fill', '#CC0512' ); // turn on red LED
    boardLeds[0].setAttribute('fill', ledsDefaultColor); // turn off green LED
  } else {
    boardLeds[1].setAttribute('fill', ledsDefaultColor ); // turn off red LED
    boardLeds[0].setAttribute('fill', '#42B205'); // turn on green LED
  }
  
  // check if we continue oscillating or if it was the last time by now
  if ( ledToggling === true ) ledToggleT = setTimeout(toggleLEDs, 1000);
}

// function that handles BTN press & toggles on/off the LEDs oscillator
boardButtons[0].addEventListener('click', function(e){
  console.log('BTN clicked !');
  if ( ledToggling === true ){
    ledToggling = false;
    clearTimeout( ledToggleT );
    ledToggleT = undefined; // necessary on Espruino
  } else {
    ledToggling = true;
    toggleLEDs(); // start LEDs oscillator
  }
})
