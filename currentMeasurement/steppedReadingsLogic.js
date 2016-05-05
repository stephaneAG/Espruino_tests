
// code logic for a unique 'stuff' value to be stepped upon & averaged across 'handleStuff' calls
var steps = 5; // number of steps to average a value / differ value confirmation ( the result in a final value for 'stuff' )
var stuffs = []; // array where 'll be stored successive 'stuff's

function handleStuff(stuff){
  
  // check steps
  if( stuffs.length < steps-1 ){ // we need to step again
    stuffs.push( stuff ); // push the stuff value to the related array
    console.log('still ' + ( steps - stuffs.length ) + ' steps to go')
    return; // exit out of the handleStuff fcn
  } else {
    // compute an average 'stuff' value from those in the 'stuffs' array
    //var stuff = stuffs.reduce(function(pv, cv){ return pv + cv }, 0) / steps; // should be supported on Espruino
    var stuff = stuffs.reduce(function(pv, cv){ return pv + cv }, 0) / stuffs.length; // clearer
    stuffs = []; // reset the 'stepping array'
    console.log('avarage stuff computed from ' + steps + ' stuffs')
  }
  
  // handle stuff normally ( as if we were not 'stepping' )
  console.log('current stuff value: ' + stuff);
}
