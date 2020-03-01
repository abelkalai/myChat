import React, { useState } from "react";
import { fieldInput } from "../hooks/customHooks";
import Signup from "./Signup";
import "../styles/all.css";

const Login = () => {
  const [activeUser, setActiveUser] = useState(false);
  const [showSignUp, setSignUp] = useState(false);
  const user = fieldInput("string");
  const pass = fieldInput("String");

  const loginForm = () => {
    return (
      <div>
        <h1> Login</h1>
        <form>
          <div>
            username:{""}
            <input value={user.value} onChange={user.onChange} />
          </div>
          <div>
            password:{""}
            <input
              value={pass.value}
              onChange={pass.onChange}
              type="password"
            />
          </div>
          <div>
            <button type="submit">login</button>
          </div>
        </form>
        <div>
          <button onClick={() => setSignUp(!showSignUp)}>
            {showSignUp ? `Hide SignUp` : `SignUp`}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="center">
      <h1>Welcome to MyChat</h1>
      <p>
        My Chat is a platform used to connect with friends and family and
        message one another!
      </p>
      {activeUser == false && loginForm()}
      {showSignUp == true && <Signup />}
    </div>
  );
};

export default Login;
