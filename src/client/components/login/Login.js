import React, { useState } from "react";
import { fieldInput } from "../../hooks/customHooks";
import Forgot from "./Forgot";
import "../../styles/all.css";

const Login = props => {
  const [loginError, setLoginError] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [forgot, setForgot] = useState("");
  const [loggedIn, setLoggedIn] = useState(props.loggedInQuery.data.loggedIn);
  const user = fieldInput();
  const pass = fieldInput();

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
    };

    return (
      <div className="center">
        <h1> Login</h1>
        <form onSubmit={submitLogin}>
          <div>
            username:
            <input value={user.value} onChange={user.onChange} required />
            {loginError == null ? null : (
              <span className="error">{loginError}</span>
            )}
            <button
              type="button"
              onClick={() => setForgot("Username")}
              className="forgotLabel"
            >
              Forgot Username
            </button>
          </div>
          <div>
            password:
            <input
              value={pass.value}
              onChange={pass.onChange}
              required
              type="password"
            />
            {loginError == null ? null : (
              <span className="error">{loginError}</span>
            )}
            <button
              type="button"
              onClick={() => setForgot("Password")}
              className="forgotLabel"
            >
              Forgot Password
            </button>
          </div>
          <div>
            <button type="submit">login</button>
          </div>
        </form>
      </div>
    );
  };

  const userActive = () => {
    const logOut = async event => {
      event.preventDefault();
      document.cookie =
        "token=;expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
      setActiveUser(null);
      setLoggedIn(null);
    };

    const userInfo = activeUser ? activeUser : loggedIn;

    return (
      <div className="center">
        <h1>Hi {`${userInfo.firstName} ${userInfo.lastName}`} </h1>
        <button onClick={logOut}> Log Out</button>
      </div>
    );
  };

  
  return (
    <div className="center">
      <p>
        My Chat is a platform used to connect with friends and family and
        message one another!
      </p>
      {loggedIn == null && forgot == "" && !activeUser && loginForm()}
      {forgot != "" && <Forgot type={forgot}/>}
      {loggedIn == null && forgot != "" && !activeUser && (
        <button
          type="button"
          onClick={() => {
            setForgot("");
          }}
        >
          Back to Login
        </button>
      )}
      {(activeUser || loggedIn != null) && userActive()}
    </div>
  );
};

export default Login;
