const path = require("path");

module.exports = {
  mode: "development",
  watch: true,
  entry: [path.join(__dirname, "src/client/index.jsx")],
  resolve: {
    extensions: [".js", ".css"],
    alias: {
      GraphqlDocuments: path.resolve(__dirname, "src/client/graphqlDocuments/"),
      Hooks: path.resolve(__dirname, "src/client/components/hooks/"),
      Utilities: path.resolve(__dirname, "src/client/utilities/"),
      Account: path.resolve(__dirname, "src/client/components/main/account/"),
      BaseStylesheet: path.resolve(__dirname, "src/client/assets/stylesheets/"),
      FrontStylesheets: path.resolve(
        __dirname,
        "src/client/assets/stylesheets/components/front/"
      ),
      MainStylesheets: path.resolve(
        __dirname,
        "src/client/assets/stylesheets/components/main/"
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
