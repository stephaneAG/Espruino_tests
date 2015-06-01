/*
var  l = false;
setInterval(function() {
  l = !l;
  LED1.write(l);
}, 500);
*/

//reset();

function onInit() {
  console.log("Modded");
  digitalWrite([LED1,LED2,LED3],0b100);
  setTimeout("digitalWrite([LED1,LED2,LED3],0b010);", 1000);
  setTimeout("digitalWrite([LED1,LED2,LED3],0b001);", 2000);
  setTimeout("digitalWrite([LED1,LED2,LED3],0);", 3000);
}

function toggle() {
 on = !on;
 digitalWrite(LED1, on);
 digitalWrite(LED2, on);
 digitalWrite(LED3, on);
}

var introNumCntr=0,
    introLEDTggl=function(){ 
      if(introNumCntr%2) toggle(); // LED1 & LED3 on, LED2 off // when numCntr even
      else console.log(".. counter is odd -> no toggling LEDs ..");
      introNumCntr++;
      if(introNumCntr<10){ setTimeout(function(){introLEDTggl();}, 250); }
      else if(introNumCntr==10){setTimeout(function(){toggle();}, 1750);setTimeout(function(){onInit();}, 2750);}
};

// -- Espruino Program -- /
//onInit(); // cool simple init sequence ( from the Espruino guys )
introLEDTggl();

//save();
