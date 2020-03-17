import React, {useState} from "react";
import Header from "./Header"
import Login from "./Login"
import Signup from "./Signup"

const FrontPage = props => {
  const [showLogin, setShowLogin] = useState(true);
  const [showLoginButton, setShowLoginButton] = useState(true);

  return (
    <div>
      <Header />
      {showLogin ? (
        <Login
          login={props.loginQuery}
          loggedInQuery={props.loggedInQuery}
          setShowLogin={setShowLoginButton}
          ignoreCookie={props.ignoreCookie}
          setIgnoreCookie={props.setIgnoreCookie}
          activeUser={props.activeUser}
          setActiveUser={props.setActiveUser}
        />
      ) : (
        <Signup
          addUser={props.addUser}
          validateEmail={props.validateEmail}
          setShowLogin={setShowLoginButton}
        />
      )}
      {showLoginButton && (
        <div className="center">
          <button
            type="button"
            onClick={() => {
              setShowLogin(!showLogin)
            }}
          >
            {showLogin ? `SignUp` : `Back to Login`}
          </button>
        </div>
      )}
    </div>
  );
};

export default FrontPage;
