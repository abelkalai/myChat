let path = require("path");

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "./index.jsx"),
  output: {
    path: __dirname,
    filename: "indexBundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
