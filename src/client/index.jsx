import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { ApolloProvider } from "react-apollo";
import { ApolloClient, InMemoryCache, HttpLink, split } from "apollo-boost";
import { getMainDefinition } from "apollo-utilities";
import { WebSocketLink } from "@apollo/link-ws";
import { HashRouter as Router } from "react-router-dom";

require("babel-polyfill");

const httpLink = new HttpLink({
  uri: "/graphql",
});

const domainName = window.location.hostname;
const port = process.env.PORT || 4000;
const wsLink = new WebSocketLink({
  uri: `wss://${domainName}:${port}/graphql`,
  options: {
    reconnect: true,
    lazy: true
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
  lazy: true
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
