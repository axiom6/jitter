const path  = require( "path"  );

module.exports = {
  context: __dirname,
  entry:      '../js/main/Jitter.js',
  output: {
    path:     path.resolve( __dirname ),
    filename: '../js/main/JitterWebPack.js' },
  resolve: {
    alias: {
      js:     path.resolve( __dirname, '../js'  ),
      json:   path.resolve( __dirname, '../json'),
      public: path.resolve( __dirname, '../..public' ) } },
  module: {
    rules: [
      { test: /\.json$/,   loader: "json-loader" } ] }
};