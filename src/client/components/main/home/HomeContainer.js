import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Link, Route, Redirect } from "react-router-dom";
import ChatContainer from "./chat/ChatContainer";
import Profile from "../account/profile/Profile";
import Settings from "../account/settings/Settings";
import "../../../assets/stylesheets/components/main/home.css";

const GET_IMAGE = gql`
  query getImage($_id: String!) {
    getImage(_id: $_id)
  }
`;

const HomeContainer = props => {
  document.title = "MyChat";
  const [userInfo, setUserInfo] = useState(
    props.activeUser ? props.activeUser : props.loggedIn
  );
  const [frontpage, setFrontPage] = useState(false);
  const userImage = useQuery(GET_IMAGE, { variables: { _id: userInfo._id } });
  const [showDropdown, setShowDropdown] = useState(false);
  const topBanner = () => {
    return (
      <div className="banner">
        {frontpage && <Redirect to="/" />}
        <Link to="/home" className="link">
          <div className="home-title">MyChat</div>
        </Link>
        <div className="user">
          <span className="home-image-container">
            <img
              className="home-image"
              src={`data:image/png;base64,${userImage.data.getImage}`}
            />
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
                    <span className="dropdown-settings-content">Settings</span>
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
    );
  };

  const logOut = async event => {
    event.preventDefault();
    document.cookie =
      "token = ;expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    props.setIgnoreCookie(true);
    props.setActiveUser(null);
    setFrontPage(true);
  };

  return (
    !userImage.loading && (
      <div className="main-container">
        {topBanner()}
        <Route
          exact
          path="/home"
          render={() => <ChatContainer userInfo={userInfo} />}
        />
        <Route
          path="/home/profile"
          render={() => (
            <Profile
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              userImage={userImage}
              getImage={GET_IMAGE}
            />
          )}
        />
        <Route
          path="/home/settings/"
          render={() => (
            <Settings
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              setIgnoreCookie={props.setIgnoreCookie}
              setActiveUser={props.setActiveUser}
            />
          )}
        />
      </div>
    )
  );
};

export default HomeContainer;
