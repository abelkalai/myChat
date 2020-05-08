import React, { Fragment, useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { LOGGED_IN } from "GraphqlDocuments/userDocs";
import { AppRoute } from "Utilities/utilRoute";
import FrontPage from "./front/FrontPage";
import Home from "./main/Home";
import "BaseStylesheet/base.css";

const App = () => {
  const loggedInQuery = useQuery(LOGGED_IN);
  const [ignoreCookie, setIgnoreCookie] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.visualViewport.width);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.visualViewport.width);
    });
  }, []);

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
              loggedIn={loggedInQuery.data.loggedIn}
              ignoreCookie={ignoreCookie}
              setIgnoreCookie={setIgnoreCookie}
              activeUser={activeUser}
              setActiveUser={setActiveUser}
              windowWidth={windowWidth}
            />
          }
        />
      </Fragment>
    )
  );
};

export default App;
