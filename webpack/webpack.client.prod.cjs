const { merge } = require('webpack-merge')
const common = require('./webpack.client')
const webpack = require('webpack')

const prod = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].bundle.js',
    chunkFilename: '[name].[contenthash].chunk.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          filename: '[name].[contenthash].bundle.js'
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      PHYSICS_DEBUG: JSON.stringify(false)
    })
  ]
}

module.exports = merge(common, prod)
