import React from "react";
import { Route, Redirect } from "react-router-dom";

const Out = ({ path, loggedIn, ignoreCookie, ...props }) => (
  <Route
    exact
    path={path}
    render={() =>
      loggedIn != null && !ignoreCookie ? (
        <Redirect to="/home" />
      ) : (
        props.children
      )
    }
  />
);

export const OutRoute = Out;
