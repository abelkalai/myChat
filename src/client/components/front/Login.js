import React, { useState } from "react";
import { useFieldInput } from "../hooks/customHooks";
import { Redirect } from "react-router-dom";

const Login = (props) => {
  document.title = "Login | MyChat";
  const [loginError, setLoginError] = useState(null);
  const [validateButton, showValidateButton] = useState(false);
  const [sendUser, setSendUser] = useState(null);
  const user = useFieldInput("");
  const pass = useFieldInput("");

  const [page, setPage] = useState("login");
  
  const loginForm = () => {
    const submitLogin = async (event) => {
      event.preventDefault();
      let username = user.value;
      let password = pass.value;
      let result = await props.login({
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
          setSendUser(username);
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
              value={user.value}
              onChange={user.onChange}
              required
            />
            {loginError ? <span className="error"> {loginError} </span> : null}
          </div>
          <div className="front-page-form-div">
            <label className="label-front-page-form">Password</label>
            <input
              className="input-front-page-form"
              value={pass.value}
              onChange={pass.onChange}
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
                  props.setVerifyUsername(sendUser), setPage("validate");
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
    <div className="center">
      {page === "login" && loginForm()}
      {page === "forgotUsername" && <Redirect to="/forgotUsername" />}
      {page === "forgotPassword" && <Redirect to="/forgotPassword" />}
      {page === "signup" && <Redirect to="/signup" />}
      {page === "validate" && <Redirect to="/signup/validate" />}
    </div>
  );
};

export default Login;
