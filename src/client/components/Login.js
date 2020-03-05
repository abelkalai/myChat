import React, { useState } from "react";
import { fieldInput } from "../hooks/customHooks";
import "../styles/all.css";

const Login = () => {
  const [activeUser, setActiveUser] = useState(false);
  const user = fieldInput("string");
  const pass = fieldInput("String");

  const loginForm = () => {
    return (
      <div className="center">
        <h1> Login</h1>
        <form>
          <div>
            username:{""}
            <input value={user.value} onChange={user.onChange} />
            {` Forgot Username`}
          </div>
          <div>
            password:{""}
            <input
              value={pass.value}
              onChange={pass.onChange}
              type="password"
            />
            {` Forgot Password`}
          </div>
          <div>
            <button type="submit">login</button>
          </div>
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
      {activeUser == false && loginForm()}
    </div>
  );
};

export default Login;
