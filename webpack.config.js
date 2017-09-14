const path = require('path');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }]
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'bundle.js',
  }
}
