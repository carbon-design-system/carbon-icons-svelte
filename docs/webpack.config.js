const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const { build } = require("./template");

const NODE_ENV = process.env.NODE_ENV || "development";
const PROD = NODE_ENV === "production";

module.exports = async () => {
  await build();

  return {
    stats: "errors-only",
    mode: NODE_ENV,
    devtool: PROD ? false : "cheap-eval-source-map",
    entry: { bundle: ["./src/index.js"] },
    resolve: {
      alias: { svelte: path.resolve("node_modules", "svelte") },
      extensions: [".mjs", ".js", ".svelte"],
      mainFields: ["svelte", "browser", "module", "main"],
    },
    output: { path: `${__dirname}/build`, filename: "[name].[chunkhash].js" },
    module: {
      rules: [
        {
          test: /\.svelte$/,
          use: {
            loader: "svelte-loader",
            options: { emitCss: true, immutable: true, hotReload: true },
          },
        },
        {
          test: [/\.css$/],
          sideEffects: true,
          use: [{ loader: MiniCssExtractPlugin.loader }, "css-loader"],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: PROD ? "[name].[chunkhash].css" : "[name].css",
      }),
      new HtmlWebpackPlugin({ template: "public/index.html" }),
    ],
  };
};
