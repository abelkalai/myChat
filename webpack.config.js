const path = require("path");

module.exports =  {
  
  mode: "development",
  entry: [path.join(__dirname, "./src/client/index.jsx")],
  watch: true,
  output: {
    path: path.resolve(__dirname, './src/client/dist'),
    filename: "bundle.js"
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
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg)$/,
        use: "url-loader"
      }
    ]
  },
  devtool: 'source-map'
};

