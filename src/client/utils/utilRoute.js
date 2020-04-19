import React from "react";
import { Route, Redirect } from "react-router-dom";

const Out = ({ loggedIn, ignoreCookie, activeUser, ...props }) =>
  (loggedIn != null && !ignoreCookie) || activeUser ? (
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

const In = ({ path, loggedIn, ignoreCookie, activeUser, ...props }) =>
  (loggedIn != null && !ignoreCookie) || activeUser ? (
    <Route path="/home" render={() => props.children} />
  ) : null;

export const OutRoute = Out;
export const InRoute = In;
