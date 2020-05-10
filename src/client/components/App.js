import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { LOGGED_IN } from "GraphqlDocuments/userDocs";
import { AppRoute } from "Utilities/utilRoute";
import LoginPage from "./loginPage/LoginPage"
import HomePage from "./homePage/HomePage";
import "BaseStylesheet/base.css";

const App = () => {
  const [ignoreCookie, setIgnoreCookie] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.visualViewport.width);
  const { loading, data } = useQuery(LOGGED_IN);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowWidth(window.visualViewport.width);
    });
  }, []);

  return (
    !loading && (
      <AppRoute
        cookieData={data.loggedIn}
        ignoreCookie={ignoreCookie}
        loginData={loginData}
        loginPage={
          <LoginPage
            setLoginData={setLoginData}
          />
        }
        homePage={
          <HomePage
            cookieData={data.loggedIn}
            ignoreCookie={ignoreCookie}
            setIgnoreCookie={setIgnoreCookie}
            loginData={loginData}
            setLoginData={setLoginData}
            windowWidth={windowWidth}
          />
        }
      />
    )
  );
};

export default App;
