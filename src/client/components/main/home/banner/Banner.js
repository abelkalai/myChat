import React, { useState, useEffect, Fragment } from "react";
import { NavLink, Link } from "react-router-dom";
import "MainStylesheets/banner.css";

const Banner = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    let dropdownDummy = false;
    const toggleDropdown = (event) => {
      if (
        event.target.id === "dropdown" ||
        event.target.id === "dropdown-menu-img"
      ) {
        setShowDropdown(!dropdownDummy);
        dropdownDummy = !dropdownDummy;
      } else if (
        event.target.id === "dropdown-logout" ||
        event.target.id === "dropdown-logout-name"
      ) {
        document.removeEventListener("click", toggleDropdown);
      } else if (dropdownDummy === true) {
        setShowDropdown(false);
        dropdownDummy = false;
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
      <div className="banner-title">
        <NavLink
          to="/home/messages"
          activeClassName="linkActive"
          className="banner-link"
        >
          MyChat
        </NavLink>
      </div>
      <div className="user-wrapper">
        <div className="user">
          {props.windowWidth > 450 ? (
            <Fragment>
              {props.userImage.loading ? (
                <img
                  alt={props.userInfo.fullName}
                  className="user-image"
                  src="images/profilePlaceholder.png"
                />
              ) : (
                <img
                  className="user-image"
                  src={`data:image/png;base64,${props.userImage.data.getProfilePicture}`}
                />
              )}

              <div className="user-name">{props.userInfo.firstName}</div>
            </Fragment>
          ) : null}
          <span className="dropdown-wrapper">
            <span id="dropdown" className="dropdown">
              <img id="dropdown-menu-img" src="images/dropdown.png" />
            </span>
          </span>
          {showDropdown ? (
            <span className="dropdown-content">
              <NavLink
                to="/home/profile"
                className="dropdown-nav-link"
                activeClassName="linkActive"
              >
                <div className="dropdown-profile">
                  <span className="dropdown-profile-content">Profile</span>
                </div>
              </NavLink>
              <NavLink
                to="/home/settings/general"
                className="dropdown-nav-link"
                activeClassName="linkActive"
              >
                <div className="dropdown-settings">
                  <span className="dropdown-settings-content">Settings</span>
                </div>
              </NavLink>
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
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Banner;
