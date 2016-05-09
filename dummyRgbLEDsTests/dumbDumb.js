// haha
function cb(tries, maxTries){
  if(tries < maxTries ){
    console.log('try: ' + tries + '=> still work to do ..');
    tries ++;
    setTimeout(function(){ cb(tries, maxTries) }, 500);
  } else {
    console.log('done working !');
  }
}
setTimeout(function(){ cb(0,20) }, 500);


// haha2
function cb(tries, maxTries, fadeStep, fadeSpeed){
  if(tries < maxTries ){
    console.log('try: ' + tries + ' => still work to do ..');
    tries += fadeStep;
    setTimeout(function(){ cb(tries, maxTries, fadeStep, fadeSpeed); }, 500);
  } else {
    console.log('tries: ' + tries + ' => done working !');
  }
}
cb(0, 1, 0.01, 500);


// haha3
function cb(tries, maxTries, fadeStep, fadeSpeed){
  if(tries < maxTries ){
    console.log('try: ' + tries + ' => still work to do ..');
    tries += fadeStep;
    tries = Number(tries.toFixed(2)); // wanr: SLOW !discard any .00xxxxxxx
    setTimeout(function(){ cb(tries, maxTries, fadeStep, fadeSpeed); }, 500);
  } else {
    console.log('tries: ' + tries + ' => done working !');
  }
}
cb(0, 1, 0.01, 100);


// haha4
function tweenColor(pin, from, to, fadeStep, fadeSpeed, callback){
  if(from < to ){
    console.log('PIN: ' + from + ' => ' + to );
    from += fadeStep;
    from = Number(from.toFixed(2)); // wanr: SLOW !discard any .00xxxxxxx
    setTimeout(function(){ tweenColor(pin, from, to, fadeStep, fadeSpeed, callback); }, fadeSpeed);
  } else {
    console.log('tries: ' + from + ' => done working !');
    callback();
  }
}
tweenColor('B4', 0, 1, 0.01, 10, function(){ console.log('DOOOONE!') });


// hoho
var r = g = b = 0;
function loopOver(){
  if( r < 10 ){
    r += 1;
    console.log('R: ' + r);
    setTimeout(function(){ loopOver(); }, 10)
  } else { console.log('R: ' + r); }
}
loopOver()


// hihi ( getting somewhere .. ) 
var theLol = true;
var myDelayedFcn = function(){
  if( theLol === true ){
    console.log('lol !');
    setTimeout(myDelayedFcn, 100);
  }
  else console.log('done !');
}

setTimeout(function(){ 
  myDelayedFcn();
}, 100)


// hihi2
var theLol = true;
var theTimeout = undefined;
var myDelayedFcn = function(){
  if( theLol === true ){
    console.log('lol !');
    theTimeout = setTimeout(myDelayedFcn, 10);
  }
  else console.log('done !');
}

theTimeout = setTimeout(function(){ 
  myDelayedFcn();
}, 10)


// hihi3
var theLol = true;
var idx = 0;
var theTimeout = undefined;
var myDelayedFcn = function(){
  //if( theLol === true ){ // speed is ok
  if( idx < 256 ){
    idx++;
    console.log(idx + 'lol !');
    theTimeout = setTimeout(myDelayedFcn, 10);
  }
  else console.log('done !');
}

theTimeout = setTimeout(function(){ 
  myDelayedFcn();
}, 10)


// hihi4
var idx = 0;
var theTimeout = undefined;
var myDelayedFcn = function(){
  if( idx < 256 ){
    idx++;
    console.log('IDX: ' + idx);
    theTimeout = setTimeout(myDelayedFcn, 10);
  }
  else console.log('done !');
}

theTimeout = setTimeout(function(){ 
  myDelayedFcn();
}, 10)


// timed1 -- range0to256: 2656.537ms --
var idx = 0;
var theTimeout = undefined;
var myDelayedFcn = function(){
  if( idx < 256 ){
    idx++;
    console.log('IDX: ' + idx);
    theTimeout = setTimeout(myDelayedFcn, 10);
  }
  else { console.log('done !'); console.timeEnd("range0to256"); }
}

theTimeout = setTimeout(function(){
  console.time("range0to256");
  myDelayedFcn();
}, 10)


// timed2 -- range0to1: 2560.294ms --
var idx = 0;
var theTimeout = undefined;
var myDelayedFcn = function(){
  if( idx < 1 ){
    idx += 0.0025;
    console.log('IDX: ' + idx);
    theTimeout = setTimeout(myDelayedFcn, 6.99);
  }
  else { console.log('done !'); console.timeEnd("range0to256"); }
}

theTimeout = setTimeout(function(){
  console.time("range0to1");
  myDelayedFcn();
}, 6.99)


// timed1alt -- range0to256alt: 2657.394ms --
var idx = 0;
var theTimeout = undefined;
var myDelayedFcn = function(){
  if( idx < 256 ){
    idx++;
    console.log('IDX: ' + idx/256);
    theTimeout = setTimeout(myDelayedFcn, 10);
  }
  else { console.log('done !'); console.timeEnd("range0to256alt"); }
}

theTimeout = setTimeout(function(){
  console.time("range0to256alt");
  myDelayedFcn();
}, 10)


// actual Espruino code ( original board )
var redPin = B9;
var bluePin = B8;
var greenPin = B4;
var rgbLED = {red: 0, green: 0, blue: 0 };
var red = 0;
var green = 0;
var blue = 0;
var colorTweenTimeout = undefined;

// debug helper
function tweenColor(pin, channel, from, to, callback){
  if( from < to ){
    //from++;
    from+= 0.05;
    //console.log('IDX: ' + from/to);
    console.log('IDX: ' + from);
    colorTweenTimeout = setTimeout(function(){ tweenColor(pin, channel, from, to, callback) }, 10);
  }
  else { console.log('done !'); callback(); }
}

// debug helper that goes both ways
function tweenColor(pin, channel, from, to, callback){
  if( from < to ){
    //from++;
    from+= 0.05;
    //console.log('IDX: ' + from/to);
    console.log('PIN: ' + pin + ' IDX: ' + from);
    colorTweenTimeout = setTimeout(function(){ tweenColor(pin, channel, from, to, callback) }, 100);
  }
  else if( from > to ){
    //from++;
    from-= 0.05;
    //console.log('IDX: ' + from/to);
    console.log('PIN: ' + pin + ' IDX: ' + from);
    colorTweenTimeout = setTimeout(function(){ tweenColor(pin, channel, from, to, callback) }, 100);
  }
  else { console.log('done !'); callback(); }
}
// -> one should work ;) => DOES ;P
// R/ to cancel: clearTimeout( colorTweenTimeout );
function tweenColor(pin, channel, from, to, dir, callback){
  console.log('channel:' + channel);
  console.log('GLOBAL RGB => R:' + rgbLED.red + ' G:' + rgbLED.green + 'B: ' + rgbLED.blue);
  if( from < to && dir === 0 ){
    //from++;
    from+= 0.05;
    rgbLED.channel = from;
    //console.log('IDX: ' + from/to);
    console.log('PIN: ' + pin + ' IDX: ' + from);
    colorTweenTimeout = setTimeout(function(){ tweenColor(pin, channel, from, to, dir, callback) }, 100);
  }
  else if( from > to && dir === 1 ){
    //from++;
    from-= 0.05;
    rgbLED.channel = from;
    //console.log('IDX: ' + from/to);
    console.log('PIN: ' + pin + ' IDX: ' + from);
    colorTweenTimeout = setTimeout(function(){ tweenColor(pin, channel, from, to, dir, callback) }, 100);
  }
  else { console.log('done !'); callback(); }
}



// desired logic
function blueToViolet(){
  //tweenColor(redPin, red, 0, 1, violetToRed);
  console.log('blue to violet -> 0 to 1');
  tweenColor(redPin, 'red', 0, 1, 0, violetToRed);
}
function violetToRed(){
  //tweenColor(bluePin, blue, 1, 0, redToYellow);
  console.log('violet to red -> 1 to 0');
  tweenColor(bluePin, 'blue', 1, 0, 1, redToYellow);
}
function redToYellow(){
  //tweenColor(greenPin, green, 0, 1, yellowToGreen);
  console.log('red to yellow -> 0 to 1');
  tweenColor(greenPin, 'green', 0, 1, 0, yellowToGreen);
}
function yellowToGreen(){
  //tweenColor(redPin, red, 1, 0, greenToAqua);
  console.log('yellow to green -> 1 to 0');
  tweenColor(redPin, 'red', 1, 0, 1, greenToAqua);
}
function greenToAqua(){
  //tweenColor(bluePin, blue, 0, 1, aquaToBlue);
  console.log('green to aqua -> 0 to 1');
  tweenColor(bluePin, 'blue', 0, 1, 0, aquaToBlue);
}
function aquaToBlue(){
  //tweenColor(greenPin, green, 1, 0, blueToViolet);
  console.log('aqua to blue -> 1 to 0');
  tweenColor(greenPin, 'green', 1, 0, 1, blueToViolet);
}
