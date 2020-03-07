import React, { useState } from "react";
import { fieldInput } from "../hooks/customHooks";
import "../styles/all.css";

const Login = props => {
  const [forgotUser, setForgotUser] = useState(false);
  const [forgotPass, setForgotPass] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [activeUser, setactiveUser] = useState(null);
  const user = fieldInput();
  const pass = fieldInput();
  const email = fieldInput();

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
        setactiveUser(true);
        document.cookie=`token=${result.data.login.Token}`

      } else {
        setLoginError(result.data.login.errorList);
      }
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
            <button onClick={() => setForgotUser(true)} className="forgotLabel">
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
            <button onClick={() => setForgotPass(true)} className="forgotLabel">
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

  const forgotUserForm = () => {
    return (
      <div className="center">
        <h1> Forgot Username</h1>
        <form>
          <div>
            Enter Email Address:{" "}
            <input value={email.value} onChange={email.onChange} required />
            <button type="submit">Submit</button>{" "}
          </div>
        </form>
      </div>
    );
  };

  const forgotPassForm = () => {
    return (
      <div className="center">
        <h1> Forgot Password</h1>
        <form>
          <div>
            Enter Email Address:{" "}
            <input value={email.value} onChange={email.onChange} required />
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
  };

  const loggedIn = () => {
    const logOut = async event  => {
      event.preventDefault()
      setactiveUser(false)
    };

    return (
      <div className="center">
        <h1>Hi </h1>
        <form>
          <button onClick={logOut}> Log Out</button>
        </form>
      </div>
    );
  };

  return (
    <div className="center">
      <p>
        My Chat is a platform used to connect with friends and family and
        message one another!
      </p>
      {!activeUser && !forgotUser && !forgotPass && loginForm()}
      {!activeUser && forgotUser && forgotUserForm()}
      {!activeUser && forgotPass && forgotPassForm()}
      {!activeUser && (forgotUser || forgotPass) && (
        <button
          onClick={() => {
            setForgotUser(false), setForgotPass(false);
          }}
        >
          Back to Login
        </button>
      )}

      {activeUser && loggedIn()}
    </div>
  );
};

export default Login;
