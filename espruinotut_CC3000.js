var wlan = require("CC3000").connect();
wlan.connect( "Seedsdesign", "jaimelesfraisesdesbois666", function (s) { 
  if (s=="dhcp") {
    /* code for client */
    /*
    require("http").get("http://www.pur3.co.uk/hello.txt", function(res) {
      res.on('data', function(data) {
        console.log(">" + data);
      });
    });
    */
    /* code for server */
    console.log("My IP is "+wlan.getIP().ip);
    require("http").createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write('Hello World');
      res.end();
    }).listen(80);
    
  }
});
