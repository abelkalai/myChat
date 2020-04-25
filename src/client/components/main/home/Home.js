import React, { useState, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_IMAGE } from "../../../graphqlDocuments/user";
import { Switch, Link, Route, Redirect } from "react-router-dom";
import ChatContainer from "./chat/ChatContainer";
import Profile from "../account/profile/Profile";
import Settings from "../account/settings/Settings";
import "../../../assets/stylesheets/components/main/home.css";
import InvalidLink from "../../../utils/InvalidLink";

import "../../../assets/stylesheets/components/main/home.css";

const Home = (props) => {
  const [userInfo, setUserInfo] = useState(
    props.activeUser ? props.activeUser : props.loggedIn
  );
  const userImage = useQuery(GET_IMAGE, { variables: { _id: userInfo._id } });
  const [showDropdown, setShowDropdown] = useState(false);

  const banner = () => {
    return (
      <div className="banner">
        <Link to="/home" className="link">
          <div className="home-title">MyChat</div>
        </Link>
        <div className="user-container">
          <div className="user">
            <span className="home-image-container">
              {userImage.loading ? (
                <img
                  alt={userInfo.fullName}
                  className="home-image"
                  src="../../../assets/images/profilePlaceholder.png"
                />
              ) : (
                <img
                  className="home-image"
                  src={`data:image/png;base64,${userImage.data.getImage}`}
                />
              )}
            </span>
            <span
              className="dropdown"
              onMouseOver={() => {
                setShowDropdown(true);
              }}
              onMouseLeave={() => {
                setShowDropdown(false);
              }}
            >
              {userInfo.fullName}
              {!showDropdown ? null : (
                <div className="dropdown-content">
                  <Link to={`/home/profile`} className="link">
                    <div className="dropdown-profile">
                      <span className="dropdown-profile-content">Profile</span>
                    </div>
                  </Link>
                  <Link to={`/home/settings/general`} className="link">
                    <div className="dropdown-settings">
                      <span className="dropdown-settings-content">
                        Settings
                      </span>
                    </div>
                  </Link>
                  <div className="dropdown-logout" onClick={logOut}>
                    <span className="dropdown-logout-content">Log Out</span>
                  </div>
                </div>
              )}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const logOut = async (event) => {
    event.preventDefault();
    document.cookie =
      "token = ;expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    props.setIgnoreCookie(true);
    props.setActiveUser(null);
  };

  return (
    <Fragment>
      {banner()}
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
