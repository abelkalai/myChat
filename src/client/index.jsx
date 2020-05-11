import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient, InMemoryCache, HttpLink, split } from "apollo-boost";
import { getMainDefinition } from "apollo-utilities";
import { WebSocketLink } from "@apollo/link-ws";
import { BrowserRouter as Router} from "react-router-dom";
import App from "./components/App";

require("babel-polyfill");

const httpLink = new HttpLink({
  uri: "/graphql",
});

const domainName = window.location.hostname;

// If running locally use `ws:// ${domainName}:${port} /graphql` else `wss:// ${domainName} /graphql` for prod
const port= 4000

const wsLink = new WebSocketLink({
  uri: `wss://${domainName}/graphql`,
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
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router basename={`${location.pathname}#`}>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
