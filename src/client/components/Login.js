import React, { useState } from "react";
import { fieldInput } from "../hooks/customHooks";
import "../styles/all.css";

const Login = () => {
  const [activeUser, setActiveUser] = useState(false);
  const [forgotUser, setForgotUser] = useState(false);
  const [forgotPass, setForgotPass] = useState(false);
  const user = fieldInput();
  const pass = fieldInput();
  const email = fieldInput()

  const loginForm = () => {
    return (
      <div className="center">
        <h1> Login</h1>
        <form>
          <div>
            username:{""}
            <input value={user.value} onChange={user.onChange} required/>
            <button onClick={() => setForgotUser(true)} className="forgotLabel">
              {" "}
              Forgot Username
            </button>
          </div>
          <div>
            password:{""}
            <input
              value={pass.value}
              onChange={pass.onChange}
              required
              type="password"
            />
            <button onClick={() => setForgotPass(true)} className="forgotLabel">
              {" "}
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
        <form >
          <div>Enter Email Address: <input value={email.value} onChange={email.onChange} required/> 
          <button type="submit">Submit</button> </div>
        </form>
      </div>
    );
  };

  const forgotPassForm = () => {
    return (
      <div className="center">
        <h1> Forgot Password</h1>
        <form>
        <div>Enter Email Address: <input value={email.value} onChange={email.onChange} required/> 
        <button type="submit">Submit</button></div>
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
      {forgotUser && forgotUserForm()}
      {forgotPass && forgotPassForm()}
      {(forgotUser || forgotPass) && (
        <button
          onClick={() => {
            setForgotUser(false), setForgotPass(false);
          }}
        >
          {" "}
          Back to Login{" "}
        </button>
      )}
    </div>
  );
};

export default Login;
