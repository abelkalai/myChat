import React from "react";
import { Route, Switch } from "react-router-dom";
import FrontPageContainer from "./FrontPageContainer";
import InvalidLink from "../utilities/InvalidLink";

const FrontPage = props => {
  return (
    <div className="center">
      <Switch>
        <Route
          exact
          path = {[
            "/",
            "/forgotUsername",
            "/forgotPassword",
            "/signup"
          ]}
          render = {() => (
            <FrontPageContainer
              loginQuery = {props.loginQuery}
              ignoreCookie = {props.ignoreCookie}
              setIgnoreCookie = {props.setIgnoreCookie}
              activeUser = {props.activeUser}
              setActiveUser = {props.setActiveUser}
            />
          )}
        />
        <Route path = "*" render = {() => <InvalidLink type = "Login" />} />
      </Switch>
    </div>
  );
};

export default FrontPage;
