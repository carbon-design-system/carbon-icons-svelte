/* eslint-disable indent */
/* eslint-disable prefer-object-spread */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PROD = NODE_ENV === 'production';

module.exports = {
  devtool: IS_PROD ? false : 'source-map',
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
        use: {
          loader: 'svelte-loader',
          options: { emitCss: true, hotReload: true }
        }
      },
      {
        test: /\.css$/,
        use: [
          IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  mode: NODE_ENV,
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([{ from: 'public' }]),
    new MiniCssExtractPlugin({ filename: '[name].[chunkhash].css' }),
    new OptimizeCssAssetsPlugin({}),
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        { inject: true, template: 'public/index.html' },
        IS_PROD
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyElements: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
              }
            }
          : undefined
      )
    )
  ]
};
