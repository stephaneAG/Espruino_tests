/* the following code is a wip to measure the current drawn by a particular load
   see the schematic in the link for the circuit that goes along the code
   original code ( in C ) & tutorial ( for Arduino ) written by  -> thanks man !
   

  R => TODOs:
  - see what are the values measured by the circuit to average the current consumption of devices based on the known's range
  - see if js doesn't cause troubles for calculation with floats ( aka: if we need to * by 100, do the calc, then / by 100 )
  - test  it on an actual device ! :D
  
  StephaneAG - 2016
*/

// the following mostly mirrors the original C code
var currentMeasure = {}
currentMeasure.analogInputAmps = 'A0';
currentMeasure.readAmpsADC = 0;
currentMeasure.amps = 0.0;
currentMeasure.fmap = function(x, in_min, in_max, out_min, out_max){ return (x - in_min)*(out_max - out_min) / (in_max - in_min) + out_min; }

// to get readings using the above code ( ex: from a loop )
//currentMeasure.readAmpsADC = analogRead(currentMeasure.analogInputAmps); // not available since I'm writing this in a brower ;p
currentMeasure.readAmpsADC = 3;
currentMeasure.amps = Math.abs( currentMeasure.fmap(currentMeasure.readAmpsADC, 0.0, 1023, 0.01, 5.0) );
currentMeasure.amps = currentMeasure.amps * 10;

// for a simpler version ( since we use js ;P )
currentMeasure.getAmps = function(pin){
  //var readAmpsADC = analogRead(pin); // not available since I'm writing this in a brower ;p
  var readAmpsADC = 3;
  var amps = Math.abs( currentMeasure.fmap(readAmpsADC, 0.0, 1023, 0.01, 5.0) );
  return amps * 10;
}

// for an even shorter version, self-sufficient
getAmps = function(pin, opts){
  if (opts === null || opts === undefined){
    opts = {
      inMin: 0.0,
      inMax: 1023.0,
      outMin: 0.01,
      outMax: 5.0
    }
    console.log('default opts used');
  } 
  //var readAmpsADC = analogRead(pin); // not available since I'm writing this in a brower ;p
  var readAmpsADC = 3;
  return 10 * Math.abs( ( (readAmpsADC - opts.inMin)*(opts.outMax - opts.outMin) / (opts.inMax - opts.inMin) + opts.outMin ) );
}
// to use, simply:
getAmps(<the_pin>)
// or
getAmps(<the_pin>, { inMin: 0.0, inMax: 1023.0, outMin: 0.01, outMax: 5.0 })
