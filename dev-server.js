var webpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var config = require('./webpack.config');
var path = require('path');

var compiler = webpack(config);

var server = new webpackDevServer(compiler,{
    //**** Start the server from specific path of project ****
    contentBase: './dist',
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

server.listen(20987, '0.0.0.0', function() {});
