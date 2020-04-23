import React, { Fragment, useState } from "react";
import FrontPage from "./front/FrontPage";
import Home from "./main/home/Home";
import { useQuery } from "@apollo/react-hooks";
import { LOGGED_IN } from "../graphqlDocuments/user";
import { AppRoute } from "../utils/utilRoute";
import "../assets/stylesheets/base.css";

const App = () => {
  const loggedInQuery = useQuery(LOGGED_IN);
  const [ignoreCookie, setIgnoreCookie] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  return (
    !loggedInQuery.loading && (
      <Fragment>
        <AppRoute
          loggedIn={loggedInQuery.data.loggedIn}
          ignoreCookie={ignoreCookie}
          activeUser={activeUser}
          frontPage={
            <FrontPage
              ignoreCookie={ignoreCookie}
              setIgnoreCookie={setIgnoreCookie}
              activeUser={activeUser}
              setActiveUser={setActiveUser}
            />
          }
          home={
            <Home
              ignoreCookie={ignoreCookie}
              setIgnoreCookie={setIgnoreCookie}
              loggedIn={loggedInQuery.data.loggedIn}
              activeUser={activeUser}
              setActiveUser={setActiveUser}
            />
          }
        />
      </Fragment>
    )
  );
};

export default App;
