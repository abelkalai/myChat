import React, { useState, Fragment } from "react";
import { useFieldInput } from "../hooks/customHooks";
import { Redirect } from "react-router-dom";
import { LOGIN } from "../../graphqlDocuments/user";
import { useMutation } from "@apollo/react-hooks";
import "../../assets/stylesheets/components/front/login.css";

const Login = (props) => {
  document.title = "Login | MyChat";
  const [loginQuery] = useMutation(LOGIN);
  const [loginError, setLoginError] = useState(null);
  const [validateButton, showValidateButton] = useState(false);
  const [verifyUser, setVerifyUser] = useState(null);
  const [verifyEmail, setVerifyEmail] = useState(null);
  const usernameField = useFieldInput("");
  const passwordField = useFieldInput("");

  const [page, setPage] = useState("login");

  const loginForm = () => {
    const submitLogin = async (event) => {
      event.preventDefault();
      let username = usernameField.value;
      let password = passwordField.value;
      let result = await loginQuery({
        variables: { username, password },
      });

      if (!result.data.login.errorList) {
        setLoginError(null);
        let date = new Date();
        date.setDate(date.getDate() + 7);
        document.cookie = `token=${
          result.data.login.Token
        }; expires= ${date.toGMTString()} path = /;`;
        props.setActiveUser(result.data.login.User);
        props.setIgnoreCookie(false);
      } else if (
        result.data.login.errorList === "Please confirm your email to login"
      ) {
        setLoginError(result.data.login.errorList);
        setVerifyEmail(result.data.login.email);
        setVerifyUser(username);
        showValidateButton(true);
      } else {
        setLoginError(result.data.login.errorList);
      }
    };

    return (
      <Fragment>
        <h1>Log In</h1>
        <div className="login-page-sign-up-container">
          <span className="grey-text">{"Don't have an account? "}</span>
          <button
            className="sign-up-button"
            type="button"
            onClick={() => {
              setPage("signup"), props.setFromLogin(true);
            }}
          >
            Sign up Now!
          </button>
        </div>
        {loginError ? <h2 className="error">{loginError}</h2> : null}
        <form className="front-page-form" onSubmit={submitLogin}>
          <div className="front-page-form-div">
            <input
              className="input-login-username"
              placeholder="Username"
              type="text"
              value={usernameField.value}
              onChange={usernameField.onChange}
              required
            />
          </div>
          <div className="front-page-form-div">
            <input
              className="input-login-password"
              placeholder="Password"
              value={passwordField.value}
              onChange={passwordField.onChange}
              required
              type="password"
            />
          </div>
          <button
            type="button"
            className="forgot-button"
            onClick={() => {
              setPage("forgotUsername");
            }}
          >
            Forgot Username?
          </button>
          <button
            type="button"
            className="forgot-button"
            onClick={() => {
              setPage("forgotPassword");
            }}
          >
            Forgot Password?
          </button>
          <div>
            <button className="login-page-button" type="submit">
              Login
            </button>
          </div>
        </form>

        {validateButton ? (
          <button
            className="login-page-validate-button"
            type="button"
            onClick={() => {
              props.setVerifyUser(verifyUser),
                props.setVerifyEmail(verifyEmail),
                setPage("validate");
            }}
          >
            Validate Email
          </button>
        ) : null}
        <div className="logo-container">
          <a
            href="https://www.linkedin.com/in/abelkalai/"
            rel="noopener noreferrer"
            target="_blank"
          >
            {/*Image source: linkedin blue style logo png from freepnglogos.com */}
            <img
              className="linkedIn-logo"
              src="../../assets/logos/linkedIn.png"
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
              className="gitHub-logo"
              src="../../assets/logos/gitHub.png"
              title="https://github.com/abelkalai"
              alt="GitHub"
            />
          </a>
        </div>
      </Fragment>
    );
  };

  return (
    <Fragment>
      {page === "login" && loginForm()}
      {page === "forgotUsername" && <Redirect push to="/forgotUsername" />}
      {page === "forgotPassword" && <Redirect push to="/forgotPassword" />}
      {page === "signup" && <Redirect push to="/signup" />}
      {page === "validate" && <Redirect push to="/signup/validate" />}
    </Fragment>
  );
};

export default Login;
