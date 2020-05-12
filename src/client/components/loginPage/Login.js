import React, { useState, useEffect, Fragment } from "react";
import { useMutation } from "@apollo/react-hooks";
import { LOGIN } from "GraphqlDocuments/userDocs";
import { useFieldInput } from "Utilities/customHooks";
import { Link } from "react-router-dom";
import "LoginPageStylesheets/login.css";

const Login = (props) => {
  const [error, setError] = useState(null);
  const [login] = useMutation(LOGIN);
  const usernameField = useFieldInput("");
  const passwordField = useFieldInput("");
  useEffect(() => {
    document.title = "Login | MyChat";
  }, []);

  const submitLoginForm = async (event) => {
    event.preventDefault();
    const username = usernameField.value.trim();
    const password = passwordField.value;
    let loginResult = await login({
      variables: { username, password },
    });
    if (!loginResult.data.login.errorList) {
      setError(null);
      const date = new Date();
      date.setDate(date.getDate() + 365);
      document.cookie = `token=${
        loginResult.data.login.Token
      }; expires= ${date.toGMTString()} path = /;`;
      props.setLoginData(loginResult.data.login.User);
    } else if (
      loginResult.data.login.errorList === "Please verify your email to login"
    ) {
      setError(loginResult.data.login.errorList);
      props.setEmailToVerify(loginResult.data.login.email);
      props.setUserToVerify(username);
    } else {
      setError(loginResult.data.login.errorList);
    }
  };

  return (
    <Fragment>
      <h1>Log In</h1>
      <div id="signup-link">
        {"Don't have an account? "}
        <Link to="/signup">
          <button type="button"> Sign up Now!</button>
        </Link>
      </div>
      {error ? <h2 className="error">{error}</h2> : null}
      <form
        className="login-page-form"
        autoComplete="off"
        onSubmit={submitLoginForm}
      >
        <div>
          <input
            id="login-username-field"
            placeholder="Username"
            type="text"
            value={usernameField.value}
            onChange={usernameField.onChange}
            required
          />
        </div>
        <div>
          <input
            id="login-password-field"
            placeholder="Password"
            value={passwordField.value}
            onChange={passwordField.onChange}
            required
            type="password"
          />
        </div>
        <Link to="/forgotUsername">
          <button type="button" className="forgot-button">
            Forgot Username?
          </button>
        </Link>
        <Link to="/forgotPassword">
          <button type="button" className="forgot-button">
            Forgot Password?
          </button>
        </Link>
        <div>
          <button id="login-button" type="submit">
            Login
          </button>
        </div>
      </form>

      {error === "Please verify your email to login" ? (
        <Link to="/signup/verify">
          <button id="verify-button" type="button">
            Verify Email
          </button>
        </Link>
      ) : null}

      <div id="logo-container">
        <a
          href="https://www.linkedin.com/in/abelkalai/"
          rel="noopener noreferrer"
          target="_blank"
        >
          {/*Image source: linkedin blue style logo png from freepnglogos.com */}
          <img
            id="linkedIn-logo"
            src="logos/linkedIn.png"
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
            id="gitHub-logo"
            src="logos/gitHub.png"
            title="https://github.com/abelkalai"
            alt="GitHub"
          />
        </a>
      </div>
    </Fragment>
  );
};

export default Login;
