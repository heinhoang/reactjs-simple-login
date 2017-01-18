var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    // The hot middleware client will make sure that when we try to access the bundle, the generated bundle will be served instead.
    'webpack-hot-middleware/client', // instruct Webpack to frst use the hot module replacement as the initial entry point 
    './source/index' // and then our source root
  ],
  output: { // output will be: path + publicPath + filename
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(), //  makes sure the modules are loaded in order
    new webpack.NoErrorsPlugin(), // prevent unnecessary error reporting in our console log
    new webpack.HotModuleReplacementPlugin() // enable the hot module loader, such as follows:
  ],
  module: {
    loaders: [{
      tests: /\.js?$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'source')
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'] // tell Webpack to resolve fles that we import regardless of them having the .js or .jsx extension such as not have to write import foo from 'foo.jsx', but can write import foo from 'foo' instead
  }
};
