/*
  to use, just 'Send to Espruino' & then save()
  then, watch the Espruino flash itself & auto-reboot while logging stuff until it completes its goals ;p
  
  Q1: what is the root object --> it could be nice to use it instead of a custom obj storing our config params/data
  Q2: any way to save stuff to the flash without rebooting ? ( save() actually reboots, right ? )
  
  by StephaneAG - 2015
*/

// factory settings  --  can be updated, but mainly here to restore stuff to a known valid state
var factory_aParam = "factoryName";
var factory_anotherParam = 0;

// current config  --  can be updated via user input(s), directly ( keyboard,.. ) or from a file/URL (SDCard, server query)
var aParam = "tef";
var anotherParam = 1500;

var pendingUpdate;
var updated;
var pendingRestore;
var restored;

// fake a pending update
var pendingUpdate = 1;
var updated_aParam = "loulou";
var updated_anotherParam = 500;

// factory reset  --  restore the initial ( factory ) settings ( /!\ != 'reset()' function, which wipes out EVERYTHING ! )
function restore(){
  // apply factory settings
  aParam = factory_aParam;
  anotherParam = factory_anotherParam;
  pendingRestore = undefined;
  restored = 1;
}

// user update  --  updates the current config params
function update(){
  // apply pending update
  aParam = updated_aParam;
  anotherParam = updated_anotherParam;
  pendingUpdate = undefined;
  updated = 1;
}

function onInit() {
  //indicate we're booting
  digitalWrite(LED1, 1); // red LED on
  
  // log our current params configuration
  console.log('-- current config --');
  console.log('aParam: ' + aParam);
  console.log('anotherParam: ' + anotherParam);
  
  // check pending changes in the current config (  update / restore )
  if(pendingRestore){ // check pending update
    console.log('pending restore !');
    // apply pending update
    restore();
    // update the vars stored in the flash
    save();
    
  } else if(pendingUpdate){ // check pending update
    console.log('pending update !');
    // apply pending update
    update();
    // update the vars stored in the flash
    save();
    
  } else {
    if(updated){
      console.log('device updated !');
      updated = undefined;
      // DBUG: test restore()
      // fake a pending restore & save for it to take effect
      pendingRestore = 1;
      save();
    } else if (restored){
      console.log('device restored !');
      restored = undefined;
    }
    console.log('no pending update !');
  }
  
  //indicate have finished booting
  digitalWrite(LED1, 0); // red LED off
  digitalWrite(LED2, 1); // green LED on
}



/* -- test run logs --

>save()                                 ==> initial reboot of the device, to debug it's onInit() behavior

Erasing Flash.....
Writing..........
Compressed 81600 bytes to 7220
Checking...
Done!
Running onInit()...

-- current config --                    ==> device boots with fake pending update & apply it before rebooting
aParam: tef
anotherParam: 1500
pending update !


>Erasing Flash.....
Writing..........
Compressed 81600 bytes to 7274
Checking...
Done!
Running onInit()...

-- current config --                    ==> device reboots with update applied, & we fake a pending restore before rebooting it
aParam: loulou
anotherParam: 500
device updated !
no pending update !


>Erasing Flash.....
Writing..........
Compressed 81600 bytes to 7275
Checking...
Done!
Running onInit()...

-- current config --                    ==> device boots with fake pending restore, which it applies before rebooting again
aParam: loulou
anotherParam: 500
pending restore !


>Erasing Flash.....
Writing..........
Compressed 81600 bytes to 7272
Checking...
Done!
Running onInit()...

-- current config --                    ==> device boots, restored with factory settings
aParam: factoryName
anotherParam: 0
device restored !
no pending update !


Calling 'save()' again ( manually, here, not to hardcode to much junk ) 'd result in the following being logged
>save()
=undefined
Erasing Flash.....
Writing..........
Compressed 81600 bytes to 7276
Checking...
Done!

Running onInit()...
-- current config --
aParam: factoryName
anotherParam: 0
no pending update !


*/
