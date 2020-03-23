import React, {useState} from "react";
import { Route } from "react-router-dom";
import Login from "./Login";
import Forgot from "./Forgot";
import Signup from "./Signup";

const FrontPageContainer = props => {
  const [verifyUsername, setVerifyUsername] = useState(null)
  const [fromLogin, setFromLogin] = useState(false)

  return (
    <div className="center">
      <h1>Welcome to MyChat!</h1>
      <p>
        My Chat is a platform used to connect with friends and family and
        message one another!
      </p>
      <Route
        exact
        path="/"
        render={() => (
          <Login
            login={props.loginQuery}
            ignoreCookie={props.ignoreCookie}
            setIgnoreCookie={props.setIgnoreCookie}
            activeUser={props.activeUser}
            setActiveUser={props.setActiveUser}
            setVerifyUsername = {setVerifyUsername}
            setFromLogin = {setFromLogin}
          />
        )}
      />

      <Route
        path="/forgotUsername"
        render={() => <Forgot type={"Username"} />}
      />

      <Route
        path="/forgotPassword"
        render={() => <Forgot type={"Password"} />}
      />

      <Route path="/signup" render={() => <Signup verifyUsername={verifyUsername} fromLogin={fromLogin}/>} />
    </div>
  );
};

export default FrontPageContainer;
