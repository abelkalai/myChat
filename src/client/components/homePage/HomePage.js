import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_PROFILE_PICTURE } from "GraphqlDocuments/userDocs";
import { Switch, Route, Redirect } from "react-router-dom";
import Banner from "./Banner";
import ChatContainer from "./chat/ChatContainer";
import Profile from "./profile/Profile";
import Settings from "./settings/Settings";
import InvalidLink from "Utilities/InvalidLink";
import "HomePageStylesheets/homePage.css";

const HomePage = (props) => {
  const [userInfo, setUserInfo] = useState(
    props.loginData ? props.loginData : props.cookieData
  );
  const userImage = useQuery(GET_PROFILE_PICTURE, {
    variables: { _id: userInfo._id },
  });
  return (
    <div id="home-page">
      <Banner
        userInfo={userInfo}
        userImage={userImage}
        windowWidth={props.windowWidth}
        setLoginData={props.setLoginData}
        setIgnoreCookie={props.setIgnoreCookie}
      />
      <Switch>
        <Route
          exact
          path={["/home/messages", "/home/messages/:paramId"]}
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
              userImage={userImage}
              setUserInfo={setUserInfo}
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
        <Route path="*" render={() => <InvalidLink type="MyChat" />} />
      </Switch>
    </div>
  );
};

export default HomePage;
