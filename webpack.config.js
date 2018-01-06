const path = require("path");

module.exports = {
  entry: "./contentScript.js",
  output: {
    filename: "contentScript.js",
    path: path.resolve(__dirname, "src")
  }
};
