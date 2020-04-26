import React, { useState, Fragment } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_IMAGE } from "../../../graphqlDocuments/user";
import Banner from "./banner/Banner";
import ChatContainer from "./chat/ChatContainer";
import Profile from "../account/profile/Profile";
import Settings from "../account/settings/Settings";
import InvalidLink from "../../../utils/InvalidLink";
import "../../../assets/stylesheets/components/main/home.css";

const Home = (props) => {
  const [userInfo, setUserInfo] = useState(
    props.activeUser ? props.activeUser : props.loggedIn
  );
  const userImage = useQuery(GET_IMAGE, {
    variables: { _id: userInfo._id },
  });

  return (
    <Fragment>
      <Banner
        userInfo={userInfo}
        setIgnoreCookie={props.setIgnoreCookie}
        setActiveUser={props.setActiveUser}
        userImage={userImage}
      />
      <Switch>
        <Route
          exact
          path={[
            "/",
            "/forgotUsername",
            "/forgotPassword",
            "/signup",
            "/signup/validate",
            "/signup/confirm",
          ]}
          render={() => <Redirect to="/home" />}
        />
        <Route
          exact
          path="/home"
          render={() => <ChatContainer userInfo={userInfo} />}
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
              setIgnoreCookie={props.setIgnoreCookie}
              setActiveUser={props.setActiveUser}
            />
          )}
        />
        <Route path="*" render={() => <InvalidLink type="MyChat" />} />
      </Switch>
    </Fragment>
  );
};

export default Home;
