const { merge } = require('webpack-merge')
const common = require('./webpack.physics')
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
      PHYSICS_DEBUG: JSON.stringify(true)
    })
  ]
}

module.exports = merge(common, prod)
