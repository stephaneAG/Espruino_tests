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

// get the board buttons
var boardButtons = boardSVG.querySelectorAll('[id*="btnToggle"]')
boardButtons.length
//> 1 -> sweet !
