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

const wsLink = new WebSocketLink({
  uri: `wss://${domainName}:30238/graphql`,
  options: {
    reconnect: true,
    lazy: true
  },
});

wsLink.subscriptionClient.on("connecting", () => {
  console.log("connecting");
});

wsLink.subscriptionClient.on("connected", () => {
  console.log("connected");
});

wsLink.subscriptionClient.on("reconnecting", () => {
  console.log("reconnecting");
});

wsLink.subscriptionClient.on("reconnected", () => {
  console.log("reconnected");
});

wsLink.subscriptionClient.on("disconnected", () => {
  console.log("disconnected");
});

wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () =>
  wsLink.subscriptionClient.maxConnectTimeGenerator.max;


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
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
