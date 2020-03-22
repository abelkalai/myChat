import React from "react";
import { Route, Redirect } from "react-router-dom";

const Out = ({ path, loggedIn, ignoreCookie, activeUser, ...props }) =>
  (loggedIn != null && !ignoreCookie) || activeUser ? (
    <Route exact path={path} render={() => <Redirect to="/home" />} />
  ) : (
    <Route path={path} render={() => props.children} />
  );

const In = ({ path, loggedIn, ignoreCookie, activeUser, ...props }) =>
  (loggedIn != null && !ignoreCookie) || activeUser ? (
    <Route path={path} render={() => props.children} />
  ) : (
    <Route path={path} render={() => <Redirect to="/" />} />
  );


export const OutRoute = Out;
export const InRoute = In;

