import React from "react";
import { Route } from "react-router-dom";

export const AppRoute = ({
  cookieData,
  ignoreCookie,
  loginData,
  loginPage,
  homePage,
}) => (
  <Route
    path="/"
    render={() =>
      (cookieData && !ignoreCookie) || loginData ? homePage : loginPage
    }
  />
);
