const webpack = require("webpack");
const autoprefixer = require("autoprefixer");

module.exports = {
  // watch: false,
  context: __dirname,
  devtool: "inline-source-map",
  node: {
    fs: "empty",
  },
  module: {
    loaders: [
      {
        test: /(\.jsx?)$/,
        exclude: /node_modules/,
        loader: "babel",
      },
      {
        test: /(\.s?css)$/,
        loader: "css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap=true&sourceMapContents=true",
        // loader: ExtractTextPlugin.extract("style", "css?sourceMap!sass?sourceMap")
      },
    ],
  },
  resolve: {
    extensions: ["", ".jsx", ".scss", ".styl", ".js"],
    modulesDirectories: [
      "node_modules",
      "shared",
    ],
  },
  postcss: [autoprefixer],
  plugins: [
    new webpack.DefinePlugin({ __DEVELOPMENT__: false, __DEVTOOLS__: false }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("test")
    }),
  ],
};
