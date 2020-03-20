import React, { useState } from "react";
import Frontpage from "./front/Frontpage";
import Home from "./main/Home";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Route } from "react-router-dom";
import { OutRoute } from "../util/util_route";
import "../assets/stylesheets/all.css";

const ADD_USER = gql`
  mutation addUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $username: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      username: $username
      password: $password
    ) {
      User {
        firstName
        lastName
        email
      }
      errorList
    }
  }
`;

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      User {
        _id
        firstName
        lastName
        email
        username
        confirmed
      }
      Token
      errorList
    }
  }
`;

const LOGGED_IN = gql`
  {
    loggedIn {
      _id
      firstName
      lastName
      email
      username
      confirmed
    }
  }
`;

const VALIDATE_EMAIL = gql`
  mutation validateAccount($email: String!, $validationCode: String!) {
    validateAccount(email: $email, validationCode: $validationCode)
  }
`;

const App = () => {
  const [addUser] = useMutation(ADD_USER);
  const [validateEmail] = useMutation(VALIDATE_EMAIL);
  const [loginQuery] = useMutation(LOGIN, {
    refetchQueries: [{ query: LOGGED_IN }]
  });

  const loggedInQuery = useQuery(LOGGED_IN);
  const [ignoreCookie, setIgnoreCookie] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  return (
    !loggedInQuery.loading && (
      <div>
        <OutRoute
          exact
          path="/"
          loggedIn={loggedInQuery.data.loggedIn}
          ignoreCookie={ignoreCookie}
        >
        <Frontpage
          addUser={addUser}
          validateEmail={validateEmail}
          loginQuery={loginQuery}
          ignoreCookie={ignoreCookie}
          setIgnoreCookie={setIgnoreCookie}
          activeUser={activeUser}
          setActiveUser={setActiveUser}
        />
        </OutRoute>
        <Route
          path="/home/"
          render={() => (
            <Home
              ignoreCookie={ignoreCookie}
              setIgnoreCookie={setIgnoreCookie}
              loggedIn={loggedInQuery.data.loggedIn}
              activeUser={activeUser}
              setActiveUser={setActiveUser}
            />
          )}
        />
      </div>
    )
  );
};

export default App;
