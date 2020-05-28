module.exports = require('@oftherivier/tools/webpack')({
  module: {
    rules: {
      pegjs: {
        loader: 'pegjs-loader',
        test: /\.pegjs$/,
        exclude: /node_modules/
      }
    }
  }
})
