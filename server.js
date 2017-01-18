var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');
var port = process.env.PORT || 8080;
var app = express();
var compiler = webpack(config); //  equivalent to starting Webpack from the command line with `webpack –config webpack.config.js`
// define the assets folder as a static folder in Express
// this allows us refering `<link href="app.css">` instead of `<link href="assets/app.css">` in index.html
app.use('/', express.static(path.join(__dirname, 'assets')));

// The dev middleware is a wrapper for Webpack that serves the files emitted from Webpack in memory rather than bundling them as files
app.use(require('webpack-dev-middleware')(compiler, {
  quiet: true, // hushes up any other debug that noInfo covers
  noInfo: true, // prevent the console log from showing the Webpack compile information
  publicPath: config.output.publicPath
}));

//  ability to have any code changes reloaded and executed in the browser
app.use(require("webpack-hot-middleware")(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000 // tells the middleware how often it should update
}));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:'+port);
});

