import React, { useState } from "react";
import { useFieldInput } from "../hooks/customHooks";
import { Redirect } from "react-router-dom";
import {LOGIN} from "../../graphqlDocuments/user"
import { useMutation } from "@apollo/react-hooks";

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
      } else {
        setLoginError(result.data.login.errorList);
        if (
          result.data.login.errorList ===
          "Please confirm your email address to login"
        ) {
          setVerifyEmail(result.data.login.email);
          setVerifyUser(username);
          showValidateButton(true);
        }
        return;
      }
      props.setActiveUser(result.data.login.User);
      props.setIgnoreCookie(false);
    };

    return (
      <div>
        <h1> Login </h1>
        {validateButton ? (
          <h2 className="error">
            Your account is not validate click the button to go to the
            validation page
          </h2>
        ) : null}
        <form className="front-page-form" onSubmit={submitLogin}>
          <div className="front-page-form-div">
            <label className="label-front-page-form"> Username </label>
            <input
              className="input-front-page-form"
              type="text"
              value={usernameField.value}
              onChange={usernameField.onChange}
              required
            />
            {loginError ? <span className="error"> {loginError} </span> : null}
          </div>
          <div className="front-page-form-div">
            <label className="label-front-page-form">Password</label>
            <input
              className="input-front-page-form"
              value={passwordField.value}
              onChange={passwordField.onChange}
              required
              type="password"
            />
            {loginError ? <span className="error"> {loginError} </span> : null}
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setPage("forgotUsername"),
                  setLoginError(null),
                  user.clear(),
                  pass.clear();
              }}
              className="forgotLabel"
            >
              Forgot Username
            </button>
            <button
              type="button"
              onClick={() => {
                setPage("forgotPassword"),
                  setLoginError(null),
                  user.clear(),
                  pass.clear();
              }}
              className="forgotLabel"
            >
              Forgot Password
            </button>
            <button type="submit">Login </button>
            <button
              type="button"
              onClick={() => {
                setPage("signup"), props.setFromLogin(true);
              }}
            >
              Signup
            </button>
            {validateButton ? (
              <button
                type="button"
                onClick={() => {
                  props.setVerifyUser(verifyUser),
                    props.setVerifyEmail(verifyEmail),
                    setPage("validate");
                }}
              >
                Validate Account
              </button>
            ) : null}
          </div>
        </form>
      </div>
    );
  };

  return (
    <div>
      {page === "login" && loginForm()}
      {page === "forgotUsername" && <Redirect to="/forgotUsername" />}
      {page === "forgotPassword" && <Redirect to="/forgotPassword" />}
      {page === "signup" && <Redirect to="/signup" />}
      {page === "validate" && <Redirect to="/signup/validate" />}
    </div>
  );
};

export default Login;
