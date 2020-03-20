import React, { useState } from "react";
import { fieldInput } from "../hooks/customHooks";
import { Link, Redirect } from "react-router-dom";

const Login = props => {
  document.title="Login | MyChat"
  const [loginError, setLoginError] = useState(null);
  const user = fieldInput();
  const pass = fieldInput();

  const [page, setPage] = useState("login");
  const loginForm = () => {
    const submitLogin = async event => {
      event.preventDefault();
      let username = user.value;
      let password = pass.value;
      let result = await props.login({
        variables: { username, password }
      });

      if (result.data.login.errorList == null) {
        setLoginError(null);
        let date = new Date();
        date.setDate(date.getDate() + 1);
        document.cookie = `token=${
          result.data.login.Token
        }; expires=${date.toGMTString()} path=/;`;
      } else {
        setLoginError(result.data.login.errorList);
        return;
      }
      props.setActiveUser(result.data.login.User)
      props.setIgnoreCookie(false)
      setTimeout(()=>{setPage("loggedIn")},25)
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
                setPage("forgotUsername"),
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
                setPage("forgotPassword"),
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
            <Link className="link" to="/signup">
              <button type="button"> Signup</button>
            </Link>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="center">
      {page == "loggedIn" && <Redirect to="/home" />}
      {page == "login" && loginForm()}
      {page == "forgotUsername" && <Redirect to="/forgotUsername" />}
      {page == "forgotPassword" && <Redirect to="/forgotPassword" />}
    </div>
  );
};

export default Login;
