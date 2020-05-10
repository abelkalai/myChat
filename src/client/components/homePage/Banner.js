import React, { useState, useEffect, Fragment } from "react";
import { NavLink } from "react-router-dom";
import "HomePageStylesheets/banner.css";

const Banner = (props) => {
  const [showNavDropdown, setShowNavDropdown] = useState(false);
  useEffect(() => {
    let dropdownTemp = false;
    const toggleNavDropdown = (event) => {
      if (
        event.target.id === "nav-dropdown" ||
        event.target.id === "nav-dropdown-img"
      ) {
        setShowNavDropdown(!dropdownTemp);
        dropdownTemp = !dropdownTemp;
      } else if (
        event.target.id === "nav-logout" ||
        event.target.id === "nav-logout-text"
      ) {
        document.removeEventListener("click", toggleNavDropdown);
      } else if (dropdownTemp === true) {
        setShowNavDropdown(false);
        dropdownTemp = false;
      }
    };
    document.addEventListener("click", toggleNavDropdown);
  }, []);

  const logOut = (event) => {
    event.preventDefault();
    document.cookie =
      "token = ;expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    props.setIgnoreCookie(true);
    props.setLoginData(null);
  };

  return (
    <div id="banner">
      <div id="banner-title">
        <NavLink to="/home/messages" activeClassName="active-nav-link">
          MyChat
        </NavLink>
      </div>
      <div id="user">
        {props.windowWidth > 450 ? (
          <Fragment>
            {
              <img
                id="user-image"
                alt={props.userInfo.fullName}
                src={
                  props.userImage.loading
                    ? "images/profilePlaceholder.png"
                    : `data:image/png;base64,${props.userImage.data.getProfilePicture}`
                }
              />
            }
            <div id="user-name">{props.userInfo.firstName}</div>
          </Fragment>
        ) : null}
        <span id="nav-dropdown">
          <img id="nav-dropdown-img" src="images/dropdown.png" />
        </span>
        {showNavDropdown ? (
          <span id="nav-dropdown-content">
            <NavLink
              to="/home/profile"
              className="nav-link"
              activeClassName="active-nav-link"
            >
              <div id="nav-profile">
                <span id="nav-profile-text">Profile</span>
              </div>
            </NavLink>

            <NavLink
              to="/home/settings/general"
              className="nav-link"
              activeClassName="active-nav-link"
            >
              <div id="nav-settings">
                <span id="nav-settings-text">Settings</span>
              </div>
            </NavLink>

            <div id="nav-logout" onClick={logOut}>
              <span id="nav-logout-text">Log Out</span>
            </div>
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default Banner;
