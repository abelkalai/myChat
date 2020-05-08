import React, { useState, Fragment } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_PROFILE_PICTURE } from "GraphqlDocuments/userDocs";
import Banner from "./Banner";
import ChatContainer from "./chat/ChatContainer";
import Profile from "Account/profile/Profile";
import Settings from "Account/settings/Settings";
import InvalidLink from "Utilities/InvalidLink";

const Home = (props) => {
  const [userInfo, setUserInfo] = useState(
    props.activeUser ? props.activeUser : props.loggedIn
  );
  const userImage = useQuery(GET_PROFILE_PICTURE, {
    variables: { _id: userInfo._id },
  });
  return (
    <div className="main">
      <Banner
        userInfo={userInfo}
        setIgnoreCookie={props.setIgnoreCookie}
        setActiveUser={props.setActiveUser}
        userImage={userImage}
        windowWidth={props.windowWidth}
      />
      <Switch>
        <Route
          exact
          path={[
            "/",
            "/forgotUsername",
            "/forgotPassword",
            "/signup",
            "/signup/verify",
            "/signup/confirm",
          ]}
          render={() => <Redirect to="/home/messages" />}
        />
        <Route
          exact
          path={["/home/messages", "/home/messages/:id"]}
          render={() => (
            <ChatContainer
              userInfo={userInfo}
              windowWidth={props.windowWidth}
            />
          )}
        />
        <Route
          exact
          path="/home/profile"
          render={() => (
            <Profile
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              userImage={userImage}
            />
          )}
        />
        <Route
          exact
          path={["/home/settings/general", "/home/settings/security"]}
          render={() => (
            <Settings
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              windowWidth={props.windowWidth}
            />
          )}
        />
        <Route path="*" render={() => <InvalidLink type="MyChat" />} />
      </Switch>
    </div>
  );
};

export default Home;
