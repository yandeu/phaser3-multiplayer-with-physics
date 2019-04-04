const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: ['./src/client/index.ts'],
  output: {
    publicPath: 'static/client',
    path: path.resolve(__dirname, '../dist/client'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          filename: '[name].bundle.js'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/client/index.html'
    }),
    new CopyWebpackPlugin([{ from: 'src/client/assets', to: 'assets' }]),
    new webpack.DefinePlugin({
      PHYSICS_DEBUG: JSON.stringify(false)
    })
  ]
}
