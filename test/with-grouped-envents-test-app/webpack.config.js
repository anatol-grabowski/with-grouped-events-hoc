const path = require('path');

const config = {

  // Gives you sourcemaps without slowing down rebundling
  // devtool: 'eval-source-map',
  watch: true,
  entry: path.join(__dirname, 'component.jsx'),
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  optimization: {
    minimize: false,
  }
};
module.exports = config
