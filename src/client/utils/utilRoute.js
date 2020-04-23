import React from "react";
import { Route, Redirect } from "react-router-dom";

export const OutRoute = ({ loggedIn, ignoreCookie, activeUser, ...props }) =>
  (loggedIn && !ignoreCookie) || activeUser ? null : (
    <Route path="/" render={() => props.children} />
  );

export const InRoute = ({ loggedIn, ignoreCookie, activeUser, ...props }) =>
  (loggedIn && !ignoreCookie) || activeUser ? (
    <Route path="/" render={() => props.children} />
  ) : null;
