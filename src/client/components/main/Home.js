import React, { useState, useEffect } from "react";
import { fieldInput } from "../../hooks/customHooks";
import { HashRouter as Router, Route, Switch, Link } from "react-router-dom";
import Settings from "./account/Settings";
import "../../assets/stylesheets/components/main/main.css";

const Home = props => {
  const userInfo = props.activeUser ? props.activeUser : props.loggedIn;
  const search = fieldInput();
  useEffect(() => {
    props.setShowWelcome(false);
  });
  useEffect(() => {
    props.setShowLogin(false);
  });

  const topBanner = () => {
    return (
      <div className="banner">
        <Link to="/" className="link">
          <div className="home-title">MyChat</div>{" "}
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
              <span> Profile </span>
              <Link to={`/settings`} className="link">
                <span> Settings </span>
              </Link>
              <Link to="/" className="link" onClick={logOut}>
                <span> Log Out </span>
              </Link>
            </div>
          </span>
        </div>
      </div>
    );
  };

  const logOut = async event => {
    event.preventDefault();
    document.cookie = "token=;expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    props.setActiveUser(null);
    props.setPage("login");
    props.setIgnoreCookie(true);
    props.setShowWelcome(true);
    props.setShowLogin(true);
  };

  return (
    <div>
      {topBanner()}
      <Route path="/" />
      <Switch>
        <Route
          path={`/settings`}
          render={() => {
            <Settings user={userInfo} />;
          }}
        />
      </Switch>
    </div>
  );
};

export default Home;
