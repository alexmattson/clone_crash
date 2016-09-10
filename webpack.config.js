const path = require('path');
module.exports = {
  context: __dirname,
  entry: './lib/clone_clash.js',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devtool: 'source-maps'
};
