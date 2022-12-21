const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  stats: 'errors-warnings',
  entry: ['./src/stats/index.ts'],
  output: {
    publicPath: 'static/stats',
    path: path.resolve(__dirname, '../dist/stats'),
    filename: '[name].[contenthash].bundle.js',
    chunkFilename: '[name].[contenthash].chunk.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
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
          filename: '[name].[contenthash].bundle.js'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/stats/index.html'
    })
  ]
}
