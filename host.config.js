// Host for der server and webpack devlopment data here
var myip = require('quick-local-ip');

module.exports = {
    // For Lan Access
    hostLanIP: myip.getLocalIP4(), //"192.168.1.14",
    // For Only Local Access
    hostName: "localhost",
    // For Server Listen
    hostIP: "0.0.0.0",
    // For Server Listen & PublicPath
    hostPort: 20987
};