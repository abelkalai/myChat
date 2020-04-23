import React, {Fragment, useState } from "react";
import FrontPage from "./front/FrontPage";
import Home from "./main/home/Home";
import {useQuery} from "@apollo/react-hooks";
import {LOGGED_IN} from "../graphqlDocuments/user"
import { OutRoute, InRoute } from "../utils/utilRoute";
import "../assets/stylesheets/base.css";

const App = () => {
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
