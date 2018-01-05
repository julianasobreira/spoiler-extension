const path = require("path");

module.exports = {
  entry: "./spoiler-alert.js",
  output: {
    filename: "spoiler-alert.js",
    path: path.resolve(__dirname, "src")
  }
};
