const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  mode: NODE_ENV,
  stats: 'errors-only',
  devtool: NODE_ENV === 'production' ? false : 'cheap-eval-source-map',
  entry: { bundle: ['./src/index.js'] },
  resolve: {
    alias: { svelte: path.resolve('node_modules', 'svelte') },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },
  output: { path: `${__dirname}/build`, filename: '[name].[chunkhash].js' },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: { loader: 'svelte-loader', options: { emitCss: false, hotReload: true } }
      },
      { test: /\.css$/, use: ['style-loader'] }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: 'public/index.html' })]
};
