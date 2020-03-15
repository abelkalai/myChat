import React, { useState, useEffect } from "react";
import { fieldInput } from "../../hooks/customHooks";
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

  const homePage = () => {
    return (
      <div>
        <div className="banner">
          <div className="content">MyChat</div>
          <input
            className="searchName"
            placeholder="Search for people..."
            value={search.value}
            onChange={search.onChange}
          />
          <div className="user">
            <span className="dropdown">
              {`${userInfo.firstName} ${userInfo.lastName}`}
              <div className="dropdown-content" onClick={logOut}> Log Out</div>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const logOut = async event => {
    event.preventDefault();
    document.cookie = "token=;expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    props.setActiveUser(null);
    props.setPage("login");
    props.setIgnoreCookie(true)
    props.setShowWelcome(true);
    props.setShowLogin(true);
  };

  return <div>{homePage()}</div>;
};

export default Home;
