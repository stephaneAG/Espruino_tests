/*
  In case we have multiple spaces per box, an intermediary step may be useful to:
  - log the state changes of all the boxes at once
  - use that state to toggle some LEDs
  - be used as a buffer to "differ" the ~realtime remote updates
  
  In our context, instead of sending an SMS on a "status change" event from one of our spaces,
  we set a different status code ( 0/no device, 1/charging, 2/charged -> see statusCodesLogic.js )
  
  Once this is done, we can have more "exotic" ways to "time" our updates, that we can adjust to our preference
  ( or based on some other events ( .. ) )
  
  Basically, we can think of three different models, to which we may bind the use case of this intermediary step ( above )
  We'll call these "differedUpdateModes"
  A -> reflect the status change as fast as possible
  B -> pack the status change that happened closely in time & delay the reflection, while specifying:
    how close in time the state changes have to happen to be packed
    a maximum differed time, 
    a maximum of packed status change for one space
    a maximum of packed status change regardless of the space
    a minimum delay time after any previous packing
  C ->
  
  Long story short:
  -(TTL data)-->[stepped reading(s)]-->(states)-->(state change)-->(A or B)
  - "it's time to"--> (C)
  
*/

/* dummy logic example */
var differedUpdateMode = 'direct' // -> A ( or 'packed' --> B, or 'timed' -> C )
var timedUpdateInterval; // when using 'timed'
// at code boot / when the handlers are initiated ( nb: the fcn called should also check the same var for dynamic toggling )
if( differedUpdateMode === 'timed' ) setInterval(timedRemoteUpdate, timedUpdateInterval);
function timedRemoteUpdate(){ // allows dynamic toggling & switching between differed update modes
  if( differedUpdateMode === 'timed' ) remoteUpdate(); // C
}

// when receiving an update ( R: we should check if the states have changed before further maybe-not-needed prcesing .. )
if (differedUpdateMode === 'direct') // A
else if ( differedUpdateMode === 'packed' ){
  // if a "maximum differed time" is in use & reached, cancel any existing timeout ( the ones called from below )
  // cancel any existing timeout & set a new one for a differed update to happen
  // handle further props tweaking 
}
