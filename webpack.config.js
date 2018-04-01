module.exports = {
  entry: {
    content:'./src/js/content.js',
    background:'./src/js/background.js',
    popup:'./src/js/popup.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist/js',
    publicPath: '/',
    filename: '[name].js'
  },
  watch: true
};