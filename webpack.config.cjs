const path = require( 'path' );

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'server.js',
    path: path.resolve( __dirname, 'build' ),
    publicPath: '/'
  },
  mode: 'production',
  target: 'node',
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/, /\.test.ts$/],
        use: {
          loader: 'ts-loader',
        }
      }
    ]
  }
}



