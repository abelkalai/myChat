import React, { useState } from "react";
import { fieldInput } from "../hooks/customHooks";
import { Link, Route, Redirect } from "react-router-dom";
import Profile from "./account/profile/Profile";
import Settings from "./account/settings/Settings";
import "../../assets/stylesheets/components/main/home.css";

const Home = props => {
  document.title="MyChat"
  const [userInfo, setUserInfo] = useState(
    props.activeUser ? props.activeUser : props.loggedIn
  );
  const [frontpage, setFrontPage] = useState(false);
  const search = fieldInput();

  const topBanner = () => {
    return (
      <div className="banner">
        <Link to="/home" className="link">
          <div className="home-title">MyChat</div>
        </Link>
        <input
          className="searchName"
          placeholder="Search for people..."
          value={search.value}
          onChange={search.onChange}
        />
        <div className="user">
          <span className="dropdown">
            {`${userInfo.firstName} ${userInfo.lastName}`}
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
          </span>
        </div>
      </div>
    );
  };

  const logOut = async event => {
    event.preventDefault();
    document.cookie = "token=;expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    props.setIgnoreCookie(true);
    props.setActiveUser(null)
    setFrontPage(true);
  };

  return (
    <div>
      {topBanner()}
      {frontpage && <Redirect to="/" />}
      <Route
        path="/home/profile/"
        render={() => <Profile userInfo={userInfo} setUserInfo={setUserInfo} />}
      />
      <Route
        path="/home/settings/"
        render={() => (
          <Settings
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            setIgnoreCookie={props.setIgnoreCookie}
          />
        )}
      />
    </div>
  );
};

export default Home;
