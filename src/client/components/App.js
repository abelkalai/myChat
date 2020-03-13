import React, { useState } from "react";
import Login from "./login/Login";
import Signup from "./Signup";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import "../styles/all.css";

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


const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [addUser] = useMutation(ADD_USER);
  const [login] = useMutation(LOGIN, {
    refetchQueries: [{ query: LOGGED_IN }]
  });

  const loggedInQuery = useQuery(LOGGED_IN);

  return (
    !loggedInQuery.loading && (
      <div>
        <h1 className="center">Welcome to MyChat!</h1>
        {showLogin ? (
          <Login
            login={login}
            loggedInQuery={loggedInQuery}
          />
        ) : (
          <Signup addUser={addUser}/>
        )}
        <div className="center">
          <button type="button" onClick={() => setShowLogin(!showLogin)}>
            {showLogin ? `SignUp` : `Back to Login`}
          </button>
        </div>
      </div>
    )
  );
};

export default App;
