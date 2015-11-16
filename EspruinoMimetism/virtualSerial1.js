var Serial1 = {};

// internal buffer
Serial1.buffer = "";

// available
Serial1.available = function(){ return this.buffer.length; }

// read
Serial1.read = function(chars){ 
  if(chars===undefined || chars===0 ){
    var buff = this.buffer; // get all the content of the buffer
    this.buffer = ""; // clear buffer
    return buff; // return the content of the buffer
  } else {
    var buffChunk = this.buffer(0, chars); // get part of the buffer from its beginning
    this.buffer = this.buffer.substr(chars); // update buffer
    return buffChunk; // return part of the content of the buffer
  }
}

// print
Serial1.print = function(data){ 
  if(this.onDataCallback) this.onDataCallback( datatoString().replace('\n','\r\n') );
  else this.buffer += datatoString().replace('\n','\r\n');
}

// println
Serial1.println = function(data){ 
  if(this.onDataCallback) this.onDataCallback( datatoString().replace('\n','\r\n')+'\r\n' );
  else this.buffer += datatoString().replace('\n','\r\n')+'\r\n';
}

// write
Serial1.write = function(data){
  if(this.onDataCallback) this.onDataCallback( data+'\r\n' ); 
  else this.buffer += data+'\r\n';
}

// on
Serial1.on = function(evtType, callback){
  if(evtType==='data') this.onDataCallback = callback;
}

// remove all listeners
Serial1.removeAllListeners = function(evtType){
  if(evtType==='data') this.onDataCallback = undefined;
}

/* ---- API ---- */
Serial1.API = function(fcnName){
  if(!fcnName){
    Object.keys( Serial1 ).forEach(function(elem){
      //console.log ( elem, typeof Serial1[elem] );
      if ( typeof Serial1[elem] === "function") console.log( 'Serial1.' + elem + '()', '\r\n', Serial1[elem] );
    });
  } else {
    Object.keys( Serial1 ).forEach(function(elem){
      //console.log ( elem, typeof Serial1[elem] );
      if ( elem.startsWith(fcnName) && typeof Serial1[elem] === "function") console.log( 'Serial1.' + elem + '()', '\r\n', Serial1[elem] );
    });
  }
}
// -- prevent the API() function from being displayed when calling it to display every other fcns ;p --
Object.defineProperty(Serial1, "API", {enumerable: false});





/* ---- or more seriously ---- */
Serial = function(){
  this.name = "Serialx",
  this.buffer="",
  this.onDataCallback = undefined
};

// available
Serial.prototype.available = function(){ return this.buffer.length; }

// read
Serial.prototype.read = function(chars){ 
  if(chars===undefined || chars===0 ){
    var buff = this.buffer; // get all the content of the buffer
    this.buffer = ""; // clear buffer
    return buff; // return the content of the buffer
  } else {
    var buffChunk = this.buffer(0, chars); // get part of the buffer from its beginning
    this.buffer = this.buffer.substr(chars); // update buffer
    return buffChunk; // return part of the content of the buffer
  }
}

// print
Serial.prototype.print = function(data){ 
  if(this.onDataCallback) this.onDataCallback( datatoString().replace('\n','\r\n') );
  else this.buffer += datatoString().replace('\n','\r\n');
}

// println
Serial.prototype.println = function(data){ 
  if(this.onDataCallback) this.onDataCallback( datatoString().replace('\n','\r\n')+'\r\n' );
  else this.buffer += datatoString().replace('\n','\r\n')+'\r\n';
}

// write
Serial.prototype.write = function(data){
  if(this.onDataCallback) this.onDataCallback( data+'\r\n' ); 
  else this.buffer += data+'\r\n';
}

// on
Serial.prototype.Eon = function(evtType, callback){
  if(evtType==='data') this.onDataCallback = callback;
}

// remove all listeners
Serial.prototype.removeAllListeners = function(evtType){
  if(evtType==='data') this.onDataCallback = undefined;
}

/* ---- API ---- */
Serial.prototype.API = function(fcnName){
  if(!fcnName){
    Object.keys( Serial1 ).forEach(function(elem){
      //console.log ( elem, typeof Serial1[elem] );
      if ( typeof Serial1[elem] === "function") console.log( this.name + '.' + elem + '()', '\r\n', Serial1[elem] );
    });
    Object.keys( Serial1.constructor.prototype ).forEach(function(elem){
      //console.log ( elem, typeof Serial1[elem] );
      if ( typeof Serial1.constructor.prototype[elem] === "function") console.log( 'Serial.' + elem + '()', '\r\n', Serial1.constructor.prototype[elem] );
    });
  } else {
    Object.keys( Serial1 ).forEach(function(elem){
      //console.log ( elem, typeof Serial1[elem] );
      if ( elem.startsWith(fcnName) && typeof Serial1[elem] === "function") console.log( this.name + '.' + elem + '()', '\r\n', Serial1[elem] );
    });
    Object.keys( Serial1.constructor.prototype ).forEach(function(elem){
      //console.log ( elem, typeof Serial1[elem] );
      if ( elem.startsWith(fcnName) && typeof Serial1.constructor.prototype[elem] === "function") console.log( 'Serial.' + elem + '()', '\r\n', Serial1.constructor.prototype[elem] );
    });
  }
}
// -- prevent the API() function from being displayed when calling it to display every other fcns ;p --
Object.defineProperty(Serial, "API", {enumerable: false});


/* and now :) */
// create some serials
var Serial1 = new Serial()
var Serial2 = new Serial()
// register some listener
Serial1.Eon('data', function(data){ setTimeout( Serial2.write(data ), 2000); } )
Serial2.Eon('data', function(data){ console.log('data received from Serial1 through Serial2: ' + data); } );
// write some dummy stuff to the first Serial's buffer || any callback registered ( aka Serial2's onData )
