import React, { useState } from "react";
import Frontpage from "./front/Frontpage";
import Home from "./main/Home";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { OutRoute, InRoute } from "../utilities/util_route";
import "../assets/stylesheets/all.css";

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
  const [loginQuery] = useMutation(LOGIN);
  const loggedInQuery = useQuery(LOGGED_IN);
  const [ignoreCookie, setIgnoreCookie] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  return (
    !loggedInQuery.loading && (
      <div>
          <OutRoute
            path="/"
            loggedIn={loggedInQuery.data.loggedIn}
            ignoreCookie={ignoreCookie}
            activeUser={activeUser}
          >
            <Frontpage
              loginQuery={loginQuery}
              ignoreCookie={ignoreCookie}
              setIgnoreCookie={setIgnoreCookie}
              activeUser={activeUser}
              setActiveUser={setActiveUser}
            />
          </OutRoute>
          <InRoute
            path="/home"
            loggedIn={loggedInQuery.data.loggedIn}
            ignoreCookie={ignoreCookie}
            activeUser={activeUser}
          >
            <Home
              ignoreCookie={ignoreCookie}
              setIgnoreCookie={setIgnoreCookie}
              loggedIn={loggedInQuery.data.loggedIn}
              activeUser={activeUser}
              setActiveUser={setActiveUser}
            />
          </InRoute>
      </div>
    )
  );
};

export default App;
