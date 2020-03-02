import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "../styles/all.css";

const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div className="center">
      <h1>Welcome to MyChat!</h1>
      {showLogin ? <Login /> : <Signup />}
      <div className="center">
        <button onClick={() => setShowLogin(!showLogin)}>
          {showLogin ? `SignUp` : `Back to Login`}
        </button>
      </div>
    </div>
  );
};

export default App;
