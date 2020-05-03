import React, { useState, Fragment } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Forgot from "./Forgot";
import Signup from "./Signup";
import InvalidLink from "Utilities/InvalidLink";
import "FrontStylesheets/frontPage.css";

const FrontPage = (props) => {
  const [verifyUser, setVerifyUser] = useState(null);
  const [verifyEmail, setVerifyEmail] = useState(null);
  const [fromLogin, setFromLogin] = useState(false);

  return (
    <div className="front-page-background">
      <div className="front-page-wrapper">
        <div className="front-page-container">
          <div className="front-page">
            <div className="front-page-info">
              <h1 className="front-page-header">MyChat</h1>
              <Fragment>
                <h3> Enabling Connections</h3>
                <p className="front-page-info-about">
                  MyChat enables users to message one another
                </p>
              </Fragment>
            </div>
            <div className="front-page-content">
              <Switch>
                <Route path={["/home"]} render={() => <Redirect to="/" />} />
                <Route
                  exact
                  path="/"
                  render={() => (
                    <Login
                      login={props.loginQuery}
                      ignoreCookie={props.ignoreCookie}
                      setIgnoreCookie={props.setIgnoreCookie}
                      activeUser={props.activeUser}
                      setActiveUser={props.setActiveUser}
                      setVerifyUser={setVerifyUser}
                      setVerifyEmail={setVerifyEmail}
                      setFromLogin={setFromLogin}
                    />
                  )}
                />
                <Route
                  exact
                  path="/forgotUsername"
                  render={() => <Forgot type={"Username"} />}
                />

                <Route
                  exact
                  path="/forgotPassword"
                  render={() => <Forgot type={"Password"} />}
                />

                <Route
                  exact
                  path={["/signup", "/signup/verify", "/signup/confirm"]}
                  render={() => (
                    <Signup
                      verifyUser={verifyUser}
                      verifyEmail={verifyEmail}
                      fromLogin={fromLogin}
                    />
                  )}
                />
                <Route path="*" render={() => <InvalidLink type="Login" />} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
