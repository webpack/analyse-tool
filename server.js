"use strict";
const webpack = require("webpack");
const express = require("express");
const config = require("./webpack.config");
const path = require("path");
const port = process.env.PORT || 8080;
const app = express();
const compiler = webpack(config);
app.use(require("webpack-dev-middleware")(compiler, {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  contentBase: path.join(__dirname, "./public"),
  stats: { colors: true },
}));
app.use(require("webpack-hot-middleware")(compiler));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res
    .type(".html")
    .sendFile(path.join(__dirname, "./public/index.html"));
});
app.listen(port, "localhost", function (err) {
  if (err) {
    console.log(err);
  }

  console.log("Listening at localhost:" + port);
});
