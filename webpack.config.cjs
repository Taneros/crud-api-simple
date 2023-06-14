const path = require( 'path' );
const Dotenv = require( 'dotenv-webpack' );

module.exports = ( {env} ) => ( {

  entry: path.resolve( __dirname, 'src', 'index.ts' ),
  output: {
    filename: 'server.js',
    path: path.resolve( __dirname, 'build' ),
    publicPath: '/'
  },
  mode: 'production',
  target: 'node',
  devtool: 'source-map',
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
  },
  plugins: [
    new Dotenv( {
      path: path.resolve( __dirname, `.env.${ env }` )
    } ),
  ]
} )



