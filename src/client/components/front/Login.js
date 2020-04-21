import React, { useState } from "react";
import { useFieldInput } from "../hooks/customHooks";
import { Redirect } from "react-router-dom";
import { LOGIN } from "../../graphqlDocuments/user";
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
        <h1> Login into your account</h1>
        {validateButton ? (
          <h2 className="error">
            Your account is not validated, click the "validate account button"
            to go to the validation page
          </h2>
        ) : null}
        <form className="front-page-form" onSubmit={submitLogin}>
          <div className="front-page-form-div">
            <input
              className="input-front-page-form"
              placeholder="Username"
              type="text"
              value={usernameField.value}
              onChange={usernameField.onChange}
              required
            />
            {loginError ? <span className="error"> {loginError} </span> : null}
          </div>
          <div className="front-page-form-div">
            <input
        
              className="input-front-page-form"
              placeholder="Password"
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
                setPage("forgotUsername");
              }}
              className="forgotLabel"
            >
              Forgot Username
            </button>
            <button
              type="button"
              onClick={() => {
                setPage("forgotPassword");
              }}
              className="forgotLabel"
            >
              Forgot Password
            </button>
            <button className="general-button" type="submit">
              Login
            </button>
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
      {page === "forgotUsername" && <Redirect push to="/forgotUsername" />}
      {page === "forgotPassword" && <Redirect push to="/forgotPassword" />}
      {page === "signup" && <Redirect push to="/signup" />}
      {page === "validate" && <Redirect push to="/signup/validate" />}
    </div>
  );
};

export default Login;
