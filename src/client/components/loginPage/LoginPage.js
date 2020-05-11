import React, { useState} from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Forgot from "./Forgot";
import Signup from "./Signup";
import InvalidLink from "Utilities/InvalidLink";
import "LoginPageStylesheets/loginPageContainer.css";

const LoginPage = (props) => {
  const [userToVerify, setUserToVerify] = useState(null);
  const [emailToVerify, setEmailToVerify] = useState(null);
  const [fromLogin, setFromLogin] = useState(false);

  return (
    <div id="login-page">
      <div id="login-page-container">
        <div id="login-page-info">
          <h1>MyChat</h1>
            <h3> Enabling Connections</h3>
            <p>
              MyChat enables friends and family to message one another
            </p>
        </div>
        <div id="login-page-content">
          <Switch>
            <Route path="/home" render={() => <Redirect to="/" />} />
            <Route
              exact
              path="/"
              render={() => (
                <Login
                  login={props.loginQuery}
                  setLoginData={props.setLoginData}
                  setUserToVerify={setUserToVerify}
                  setEmailToVerify={setEmailToVerify}
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
                  userToVerify={userToVerify}
                  emailToVerify={emailToVerify}
                  fromLogin={fromLogin}
                />
              )}
            />
            <Route path="*" render={() => <InvalidLink type="Login" />} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
