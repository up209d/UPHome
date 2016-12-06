var webpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var config = require("./webpack.config");
var path = require("path");

// Get Host Config Data
var host = require("./host.config");

var compiler = webpack(config);

//Defined Hostname & Port For Development
var hostName = '0.0.0.0'; //Any host name or ip
var hostPort = '20987'; // Port will be use

var server = new webpackDevServer(compiler,{
    //**** Start the server from specific path of project ****
    contentBase: config.output.path, // "./dist" - see webpack.config.js the output path in dev case
    // Hot Module Reload
    hot: true,
    //The target file using in
    filename: config.output.filename,
    publicPath: config.output.publicPath,
    // Make the colors for the terminal logs
    stats: {
        colors: true
    }
});

server.listen(host.hostPort, host.hostIP, function() {});

console.log("----------------------------------------------------------");
console.log();
console.log('\x1b[32m',"Server Started at PublicPath: " + config.output.publicPath);
console.log('\x1b[37m','');
console.log("----------------------------------------------------------");
console.log("Please, use the PublicPath above to work with browser for stability!");
console.log();

// FOR COLORING CONSOLE LOG IN TERMINAL

// console.log('\x1b[36m%s\x1b[0m', info);  //cyan
// console.log('\x1b[33m%s\x1b[0m: ', path);  //yellow
// Here is reference of colors and other characters:
//
//     Reset = "\x1b[0m"
// Bright = "\x1b[1m"
// Dim = "\x1b[2m"
// Underscore = "\x1b[4m"
// Blink = "\x1b[5m"
// Reverse = "\x1b[7m"
// Hidden = "\x1b[8m"
//
// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
//
// BgBlack = "\x1b[40m"
// BgRed = "\x1b[41m"
// BgGreen = "\x1b[42m"
// BgYellow = "\x1b[43m"
// BgBlue = "\x1b[44m"
// BgMagenta = "\x1b[45m"
// BgCyan = "\x1b[46m"
// BgWhite = "\x1b[47m"