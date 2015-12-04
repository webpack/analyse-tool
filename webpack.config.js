const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: __dirname,
  debug: true,
  devtool: "inline-source-map",
  watchOptions: { aggregateTimeout: 200 },
  node: {
    fs: "empty",
  },
  browser: {
    fs: false,
    path: false,
  },
  entry: [
    "webpack-hot-middleware/client?reload=true",
    path.join(__dirname, "./src/app.jsx"),
  ],
  output: {
    path: path.join(__dirname, "./public/js"),
    filename: "app.js",
    // sourceMapFilename: "../maps/[file].map"
  },
  resolve: {
    extensions: ["", ".jsx", ".scss", ".js", ".json"],
  },
  postcss: [autoprefixer],
  plugins: [
    new webpack.PrefetchPlugin("react"),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("style", "../css/app.css", { allChunks: true }),
    new webpack.DefinePlugin({ __DEVELOPMENT__: true, __DEVTOOLS__: true }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
  module: {
    preLoaders: [
      {
        test: /(\.(jsx?|s?css))$/,
        loader: "source-map-loader",
      }
    ],
    loaders: [
      {
        test: /(\.jsx?)$/,
        include: [
          path.join(__dirname, "./src"),
        ],
        loader: "babel",
      },
      {
        test: /(\.s?css)$/,
        loader: ExtractTextPlugin.extract("style", "css-loader?sourceMap&modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap=true&sourceMapContents=true"),
      },
      {
        test: /\.(eot|svg|ttf|woff2?)(\?.*)?$/,
        loader: "raw!file?name=../fonts/[name].[ext]",
      },
    ],
  },
};
