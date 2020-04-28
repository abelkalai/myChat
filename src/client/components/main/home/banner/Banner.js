import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import "MainStylesheets/banner.css";

const Banner = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const toggleDropdown = (event) => {
      if (
        event.target.id === "dropdown" ||
        event.target.id === "dropdown-menu-img"
      ) {
        setShowDropdown(!showDropdown);
      } else if (
        event.target.id === "dropdown-logout" ||
        event.target.id === "dropdown-logout-name"
      ) {
        document.removeEventListener("click", toggleDropdown);
      } else {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", toggleDropdown);
  }, []);

  const logOut = async (event) => {
    event.preventDefault();
    document.cookie =
      "token = ;expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    props.setIgnoreCookie(true);
    props.setActiveUser(null);
  };

  return (
    <div className="banner">
      <Link to="/home" className="link">
        <div className="banner-title">MyChat</div>
      </Link>
      <div className="user-wrapper">
        <div className="user">
          {props.windowWidth > 450 ? (
            <Fragment>
              <span className="user-image-wrapper">
                {props.userImage.loading ? (
                  <img
                    alt={props.userInfo.fullName}
                    className="user-image"
                    src="images/profilePlaceholder.png"
                  />
                ) : (
                  <img
                    className="user-image"
                    src={`data:image/png;base64,${props.userImage.data.getImage}`}
                  />
                )}
              </span>
              <span className="user-name">{props.userInfo.firstName}</span>
            </Fragment>
          ) : null}
          <span className="dropdown-wrapper">
            <span id="dropdown" className="dropdown">
              <img
                id="dropdown-menu-img"
                src="images/dropdown.png"
              />
            </span>
          </span>
          {!showDropdown ? null : (
            <span className="dropdown-content">
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
              <div
                id="dropdown-logout"
                className="dropdown-logout"
                onClick={logOut}
              >
                <span
                  id="dropdown-logout-name"
                  className="dropdown-logout-content"
                >
                  Log Out
                </span>
              </div>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
