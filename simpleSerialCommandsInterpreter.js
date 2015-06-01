var cmd="";

Serial1.setup(9600/*baud*/);

Serial1.on('data', function () { 
  Serial1.print(data); 
  cmd+=data;
  var idx = cmd.indexOf("\r");
  while (idx>=0) { 
    var line = cmd.substr(0,idx);
    cmd = cmd.substr(idx+1);
    var s = "'"+line+"' = "+eval(line); 
    print(s);
    Serial1.println(s);
    idx = cmd.indexOf("\r");
  }
});
