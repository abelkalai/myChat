const path = require("path");

module.exports = {
  mode: "development",
  watch: true,
  entry: [path.join(__dirname, "src/client/index.jsx")],
  resolve: {
    extensions: [".js", ".css"],
    alias: {
      GraphqlDocuments: path.resolve(__dirname, "src/client/graphqlDocuments/"),
      Utilities: path.resolve(__dirname, "src/client/utilities/"),
      BaseStylesheet: path.resolve(__dirname, "src/client/assets/stylesheets/"),
      LoginPageStylesheets: path.resolve(
        __dirname,
        "src/client/assets/stylesheets/loginPage/"
      ),
      HomePageStylesheets: path.resolve(
        __dirname,
        "src/client/assets/stylesheets/homePage/"
      ),
    },
  },
  output: {
    path: path.resolve(__dirname, "src/client/dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        exclude: /node_modules/,
        use: "babel-loader",
      },

      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: "url-loader",
      },
    ],
  },
  devtool: "source-map",
};
