import React from "react";
import { Route, Redirect } from "react-router-dom";

export const OutRoute = ({ loggedIn, ignoreCookie, activeUser, ...props }) =>
  (loggedIn && !ignoreCookie) || activeUser ? (
    <Route
      exact
      path={[
        "/",
        "/forgotUsername",
        "/forgotPassword",
        "/signup",
        "/signup/validate",
        "/signup/confirm"
      ]}
      render={() => <Redirect to="/home" />}
    />
  ) : (
    <Route path="/" render={() => props.children} />
  );

export const InRoute = ({ path, loggedIn, ignoreCookie, activeUser, ...props }) =>
  (loggedIn && !ignoreCookie) || activeUser ? (
    <Route path="/home" render={() => props.children} />
  ) : null;


