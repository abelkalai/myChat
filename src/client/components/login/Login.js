import React, { useState, useEffect } from "react";
import { fieldInput } from "../../hooks/customHooks";
import Forgot from "./Forgot";
import Home from "../main/Home";

const Login = props => {
  const [loginError, setLoginError] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [forgot, setForgot] = useState("");
  const user = fieldInput();
  const pass = fieldInput();

  const [page, setPage] = useState(
    props.loggedInQuery.data.loggedIn != null && !props.ignoreCookie ? "loggedIn" : "login"
  );
 
  const loginForm = () => {
    const submitLogin = async event => {
      event.preventDefault();
      let username = user.value;
      let password = pass.value;
      let result = await props.login({
        variables: { username, password }
      });

      if (result.data.login.errorList == null) {
        user.clear();
        pass.clear();
        setLoginError(null);
        let date = new Date();
        date.setDate(date.getDate() + 1);
        document.cookie = `token=${
          result.data.login.Token
        }; expires=${date.toGMTString()} ;path=/`;
      } else {
        setLoginError(result.data.login.errorList);
        return;
      }
      setActiveUser(result.data.login.User);
      props.setShowWelcome(false)
      props.setIgnoreCookie(false)
      setPage("loggedIn")
    };

    return (
      <div className="center">
        <h1> Login</h1>
        <form onSubmit={submitLogin}>
          <div>
            Username:
            <input value={user.value} onChange={user.onChange} required />
            {<span className="error">{loginError}</span>}
            <button
              type="button"
              onClick={() => {
                setForgot("Username"),
                  setPage("forgot"),
                  setLoginError(null),
                  user.clear(),
                  pass.clear();
              }}
              className="forgotLabel"
            >
              Forgot Username
            </button>
          </div>
          <div>
            Password:
            <input
              value={pass.value}
              onChange={pass.onChange}
              required
              type="password"
            />
            {<span className="error">{loginError}</span>}
            <button
              type="button"
              onClick={() => {
                setForgot("Password"),
                  setPage("forgot"),
                  setLoginError(null),
                  user.clear(),
                  pass.clear();
              }}
              className="forgotLabel"
            >
              Forgot Password
            </button>
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div>
      {page == "login" && loginForm()}
      {page == "forgot" && <Forgot type={forgot} />}
      {page=="forgot" && !activeUser && (
        <button
          type="button"
          onClick={() => {
            setPage("login")
          }}
        >
          Back to Login
        </button>
      )}
      {(activeUser || page == "loggedIn") && !props.ignoreCookie && (
        <Home
          activeUser={activeUser}
          setActiveUser={setActiveUser}
          setPage={setPage}
          loggedIn={props.loggedInQuery.data.loggedIn}
          setShowLogin={props.setShowLogin}
          setShowWelcome={props.setShowWelcome}
          setIgnoreCookie={props.setIgnoreCookie}
        />
      )}
    </div>
  );
};

export default Login;
