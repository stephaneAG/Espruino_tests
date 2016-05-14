/*

  R: the following works to send & exec stuff from an iMac to an Espruino board ( original ) using an audio cable
  
  This is what needs to be called on the iMac side of things ( see AST - AduioSerialTest [ using Espruino's team code ] ):
  AST.audio_serial_write('digitalWrite(LED3, 1);\n', function(){ console.log('data written !'); })

  On the Espruino side, we connect to Gnd & the C11 pin ( Serial4 Rx ), & use the following code:
  var dataBuff = '';
  Serial4.setup(9600); // aka: use default Serial4 Rx pin ( C11 on original Espruino board )
  Serial4.on('data', function(data){
    dataBuff += data;
    if ( dataBuff.indexOf('\n') !== -1 ){
      print('>' + dataBuff); // prints perfectly EVERYTHING ^^
      eval ( dataBuff ); // yup, "being [too] confident" ^^
      dataBuff = ''; // clear/reset data buff
    }
  });

  The circuit & connections used were the following ( TRRS cable )
  sleeve  ----|---- Espruino Gnd
              |
             47k
           +  |
  tip ---)|-- |---- Espruino Serial4Rx/C11
        1uF     
  
  ring1
  
  ring2
  
  
  Aside from not being able to use a Bluetooth audio receiver to get stuff sent using audio serial,
  the above code is absolutely NOT error proof ( & "dangerously" calls 'eval()' .. ;p )
  
  This being said, few things can be done to improve that:
  - ensure that 'dataBuff' only contains allow stuff ? -> 'd mean encoding our chars in little chunks,
    less likely to be received ( & generated ) by pure random hazard, & then decoding them ..
    => let' do that .. later ;)
    
  - ensure that 'dataBuff' starts with the correct stuff ( & hope that no glitches 'll be received before the ending '\n' )
    -> 'd mean just checking before adding to dataBuff that we have already received the startChar,
    OR discarding anything in the buffer that's before the startChar if it contains it, or altogether otherwise
    => yup, quick & easy
  var dataBuff = '';
  var startChar = '#'
  Serial4.setup(9600); // aka: use default Serial4 Rx pin ( C11 on original Espruino board )
  Serial4.on('data', function(data){
    dataBuff += data;
    if ( dataBuff.indexOf('\n') !== -1 ){ // line ending in buffer
      if ( data.indexOf('#') !== -1 ){ // startChar present in buffer ( but gibberish may be present before it )
        dataBuff = dataBuff.substr( dataBuff.indexOf('#')+1 ); // strip gibberish BEFORE the startChar
        print('>' + dataBuff); // prints perfectly EVERYTHING ^^
        eval ( dataBuff ); // yup, "being [too] confident" ^^
      } else { // no startChar in buffer, yet a line ending ( may be got stuff from a previous session ? "whatever" )
        print('prefixing gibberish discarded: ' + dataBuff); // at least, log stg ;)
      }
      dataBuff = ''; // clear/reset data buff
    }
  });
    
*/
