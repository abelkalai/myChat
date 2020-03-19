let path = require("path");

module.exports = {
  mode: "development",
  entry: [path.join(__dirname, "./index.jsx")],
  watch: true,
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
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: "url-loader"
      }
    ]
  },
  devtool: 'source-map'
};
