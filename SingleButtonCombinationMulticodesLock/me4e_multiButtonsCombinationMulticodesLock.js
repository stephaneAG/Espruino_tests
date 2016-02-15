/* 
  the following POC code can be used to generate pin-dependant combination patterns, in order
  to get MultiButtonsCOmbintionMulticode stuff ;P
  
  Nb: we may have refactor/mod th eoriginal code to take pins in account instead of just number of presses
  
  Nb2: we could also refactor the code to itself handle the update, therefore nulling the need for a generator ;p
  
  UPDATE ^^:
  refactoring the main code to take in account not just a number but a pin ref + a num seems the to be the clearest way
  also, it voids the needs for a generator ;)
*/

// our pins
var pinX = 'A0'
var pinY = 'A1'
var pinZ = 'A2'

// what we want to generate
codes = [
  [pinX, pinY, pinY, pinY, pinZ, pinZ], //["A0", "A1", "A1", "A1", "A2", "A2"]
];

// what we wanna start with
var preCodes = [
  ['x1', 'y3', 'z2'], //["x1", "y3", "z2"]
]

// hence
preCodes[0] //["x1", "y3", "z2"]
preCodes[0][0] //"x1"

// generator fcn
function generateCodes(){
  var generatedCodes = []
  // for all codes in 'PreCodes' array
  for(var i=0; i < preCodes.length; i++){
    var generatedCode = []
    // for each code, check all it's chunks, build up an array out of them & their number, & add that to the array returned ( the generated codes )
    for(var j=0; j < preCodes[i].length; j++){
      console.log('chunk of [i=' + i + '][j=' + j + '] :' + preCodes[i][j])
      var times = preCodes[i][j].substr(1)
      var pin = window['pin' + preCodes[i][j].substr(0, 1).toUpperCase() ]
      console.log('chunk times: ' + times + ' and pin: ' + pin)
      for(var k=1; k <= times; k++){ generatedCode.push(pin) }
    }
    generatedCodes.push( generatedCode )
  }
  
  return generatedCodes
}

// using our generator fcn
generatedCodes = generateCodes()

// now, handle these in code [ & mod the main code to use pins counter instead of just numbers of hits in seconds interval ]
