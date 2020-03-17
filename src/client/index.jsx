import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { HashRouter as Router } from "react-router-dom";
require("babel-polyfill");

const client = new ApolloClient({ uri: "http://localhost:4000/graphql" });

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router> 
  </ApolloProvider>,
  document.getElementById("root")
);
