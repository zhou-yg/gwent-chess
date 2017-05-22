const path = require('path');
const webpack = require('webpack');

module.exports = {

  entry: {
    client1: path.join(__dirname, './web/index.js'),
    client2: path.join(__dirname, './web2/index.js'),
  },
  output: {
    path: __dirname,
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      '__ENV__': '"dev"'
    })
  ]
};
