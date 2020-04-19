import React, {Fragment, useState } from "react";
import FrontPage from "./front/FrontPage";
import Home from "./main/home/Home";
import { useQuery, useMutation} from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { OutRoute, InRoute } from "../utils/utilRoute";
import "../assets/stylesheets/all.css";

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      User {
        _id
        firstName
        lastName
        fullName
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
      fullName
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
      <Fragment>
          <OutRoute
            loggedIn = {loggedInQuery.data.loggedIn}
            ignoreCookie = {ignoreCookie}
            activeUser = {activeUser}
          >
            <FrontPage
              loginQuery = {loginQuery}
              ignoreCookie = {ignoreCookie}
              setIgnoreCookie = {setIgnoreCookie}
              activeUser = {activeUser}
              setActiveUser = {setActiveUser}
            />
          </OutRoute>
          <InRoute
            loggedIn = {loggedInQuery.data.loggedIn}
            ignoreCookie = {ignoreCookie}
            activeUser = {activeUser}
          >
            <Home
              ignoreCookie = {ignoreCookie}
              setIgnoreCookie = {setIgnoreCookie}
              loggedIn = {loggedInQuery.data.loggedIn}
              activeUser = {activeUser}
              setActiveUser = {setActiveUser}
            />
          </InRoute>
      </Fragment>
    )
  );
};

export default App;
