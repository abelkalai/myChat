import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Forgot from "./Forgot";
import Signup from "./Signup";
import InvalidLink from "../../utils/InvalidLink";
import "../../assets/stylesheets/components/front/frontPage.css";

const FrontPage = (props) => {
  const [verifyUser, setVerifyUser] = useState(null);
  const [verifyEmail, setVerifyEmail] = useState(null);
  const [fromLogin, setFromLogin] = useState(false);

  return (
    <div className="front-page-background">
      <div className="front-page-container">
        <div className="front-page-info">
          <div className="front-page-header">
            <h1>MyChat</h1>
          </div>
        </div>
        <div className="front-page-content">
          <Switch>
            <Route
              exact
              path={[
                "/home",
                "/home/profile",
                "/home/settings/general",
                "/home/settings/security",
              ]}
              render={() => <Redirect to="/" />}
            />
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
              path={["/signup", "/signup/validate", "/signup/confirm"]}
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
      <div className="footer">
        <a
          href="https://www.linkedin.com/in/abelkalai/"
          rel="noopener noreferrer"
          target="_blank"
        >
          {/*Image source: linkedin blue style logo png from freepnglogos.com */}
          <img
            src="../../assets/logos/linkedIn.png"
            className="logo"
            title="https://www.linkedin.com/in/abelkalai/"
            alt="LinkedIn"
          />
        </a>
        <a
          href="https://github.com/abelkalai"
          rel="noopener noreferrer"
          target="_blank"
        >
          {/*Image source: https://www.stickpng.com/img/icons-logos-emojis/tech-companies/github-logo */}
          <img
            src="../../assets/logos/gitHub.png"
            title="https://github.com/abelkalai"
            className="logo"
            alt="GitHub"
          />
        </a>
      </div>
    </div>
  );
};

export default FrontPage;
