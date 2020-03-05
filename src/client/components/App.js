import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import User from "./User";
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

const ALL_USERS = gql`
  {
    allUsers {
      firstName
      lastName
      email
      username
      password
    }
  }
`;

const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const userQuery = useQuery(ALL_USERS);
  const [addUser] = useMutation(ADD_USER, {
    refetchQueries: [{ query: ALL_USERS }]
  });
  return (
    <div>
      <h1 className="center">Welcome to MyChat!</h1>
      {showLogin ? <Login /> : <Signup addUser={addUser} />}
      <div className="center">
        <button onClick={() => setShowLogin(!showLogin)}>
          {showLogin ? `SignUp` : `Back to Login`}
        </button>
      </div>
      <User result={userQuery} />
    </div>
  );
};

export default App;
