function logStuff(){ console.log(digitalRead(A0)); }

function timedStuff(){ logStuff(); setTimeout(function(){ timedStuff(); }, 500); }

console.log('init ok !');
timedStuff();
