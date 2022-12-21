const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  stats: 'errors-warnings',
  devtool: 'inline-source-map',
  target: 'node',
  node: {
    __dirname: false
  },
  entry: './src/server/server.ts',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../dist/server')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.join(__dirname, '../src'),
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      PHYSICS_DEBUG: JSON.stringify(false)
    })
  ],
  externals: [nodeExternals()]
}
