import React from "react";
import { Route } from "react-router-dom";

export const AppRoute = ({
  loggedIn,
  ignoreCookie,
  activeUser,
  frontPage,
  home,
}) => (
  <Route
    path="/"
    render={() =>
      (loggedIn && !ignoreCookie) || activeUser ? home : frontPage
    }
  />
);
