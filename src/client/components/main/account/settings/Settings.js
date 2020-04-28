import React, { useState, useEffect } from "react";
import General from "./General";
import Security from "./Security";
import { Link, Route } from "react-router-dom";
import "../../../../assets/stylesheets/components/main/settings.css";

const Settings = (props) => {
  useEffect(() => {
    document.title = "Settings | MyChat";
  }, []);
  const [activeTab, setActiveTab] = useState(null);
  const [openMenu, setOpenMenu] = useState(true);

  return (
    <div className="main-settings">
      {props.windowWidth <= 950 ? (
        <div
          className="settings-hamburger-menu"
          onClick={() => {
            setOpenMenu(!openMenu);
          }}
        >
          {openMenu ? (
            <img src="images/hamburgerMenuOpen.png" />
          ) : (
            <img src="images/hamburgerMenuClose.png" />
          )}
        </div>
      ) : null}
      {props.windowWidth > 950 || (props.windowWidth <= 950 && !openMenu) ? (
        <div className="main-left">
          <h1>Settings</h1>
          <div className="settings-dropdown">
            <Link to="/home/settings/general" className="link">
              <div
                className={
                  activeTab === "general"
                    ? "settings-active-tab"
                    : "settings-tab"
                }
                onClick={() => {
                  setOpenMenu(true);
                }}
              >
                <img
                  className="general-settings-image"
                  src="images/generalSettings.png"
                />
                <span className="general-content">General</span>
              </div>
            </Link>
            <Link to="/home/settings/security" className="link">
              <div
                className={
                  activeTab === "security"
                    ? "settings-active-tab"
                    : "settings-tab"
                }
                onClick={() => {
                  setOpenMenu(true);
                }}
              >
                <img
                  className="security-settings-image"
                  src="images/securitySettings.png"
                />
                <span className="security-content">Security </span>
              </div>
            </Link>
          </div>
        </div>
      ) : null}

      {props.windowWidth > 950 || (props.windowWidth <= 950 && openMenu) ? (
        <div className="main-right">
          <Route
            path="/home/settings/general"
            render={() => (
              <General
                userInfo={props.userInfo}
                setUserInfo={props.setUserInfo}
                setActiveTab={setActiveTab}
              />
            )}
          />
          <Route
            path="/home/settings/security"
            render={() => (
              <Security userInfo={props.userInfo} setActiveTab={setActiveTab} />
            )}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Settings;
