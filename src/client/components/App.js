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

const VALIDATE_EMAIL = gql`
  mutation validateAccount($email: String!, $validationCode: String!) {
    validateAccount(email: $email, validationCode: $validationCode)
  }
`;

const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [addUser] = useMutation(ADD_USER);
  const [validateEmail] = useMutation(VALIDATE_EMAIL);
  const [login] = useMutation(LOGIN, {
    refetchQueries: [{ query: LOGGED_IN }]
  });

  const loggedInQuery = useQuery(LOGGED_IN);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLoginButton, setShowLoginButton] = useState(true);

  const welcomeText = () => {
    return (
      <div className="center">
        <h1>Welcome to MyChat!</h1>
        <p>
          My Chat is a platform used to connect with friends and family and
          message one another!
        </p>
      </div>
    );
  };

  return (
    !loggedInQuery.loading && (
      <div>
        {showWelcome && welcomeText()}
        {showLogin ? (
          <Login
            login={login}
            loggedInQuery={loggedInQuery}
            setShowWelcome={setShowWelcome}
            setShowLogin={setShowLoginButton}
          />
        ) : (
          <Signup
            addUser={addUser}
            validateEmail={validateEmail}
            setShowWelcome={setShowWelcome}
            setShowLogin={setShowLoginButton}
          />
        )}
        {showLoginButton && (
          <div className="center">
            <button
              type="button"
              onClick={() => {
                setShowLogin(!showLogin)
              }}
            >
              {showLogin ? `SignUp` : `Back to Login`}
            </button>
          </div>
        )}
      </div>
    )
  );
};

export default App;
