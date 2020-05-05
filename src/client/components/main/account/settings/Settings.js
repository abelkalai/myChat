import React, { useState, useEffect } from "react";
import General from "./General";
import Security from "./Security";
import { NavLink, Route } from "react-router-dom";
import "MainStylesheets/settings.css";

const Settings = (props) => {
  useEffect(() => {
    document.title = "Settings | MyChat";
  }, []);
  const [activeTab, setActiveTab] = useState("general");
  const [openMenu, setOpenMenu] = useState(false);

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
            <img src="images/hamburgerMenuClose.png" />
          ) : (
            <img src="images/hamburgerMenuOpen.png" />
          )}
        </div>
      ) : null}
      {props.windowWidth > 950 || openMenu ? (
        <div className="main-settings-left">
          <h1>Settings</h1>
          <div className="settings-dropdown">
            <div
              className={
                activeTab === "general" ? "settings-active-tab" : "settings-tab"
              }
              onClick={() => {
                setOpenMenu(false);
              }}
            >
              <NavLink
                to="/home/settings/general"
                className="link"
                activeClassName="linkActive"
              >
                <img
                  className="general-settings-image"
                  src="images/generalSettings.png"
                />
                <div className="general-content">General</div>
              </NavLink>
            </div>

            <div
              className={
                activeTab === "security"
                  ? "settings-active-tab"
                  : "settings-tab"
              }
              onClick={() => {
                setOpenMenu(false);
              }}
            >
              <NavLink
                to="/home/settings/security"
                className="link"
                activeClassName="linkActive"
              >
                <img
                  className="security-settings-image"
                  src="images/securitySettings.png"
                />
                <div className="security-content">Security </div>
              </NavLink>
            </div>
          </div>
        </div>
      ) : null}

      <div className="main-right">
        <Route
          exact
          path={["/home/settings/general", "/home/settings/general/mobileMenu"]}
          render={() => (
            <General
              userInfo={props.userInfo}
              setUserInfo={props.setUserInfo}
              setActiveTab={setActiveTab}
              windowWidth={props.windowWidth}
              openMenu={openMenu}
            />
          )}
        />
        <Route
          exact
          path={[
            "/home/settings/security",
            "/home/settings/security/mobileMenu",
          ]}
          render={() => (
            <Security
              userInfo={props.userInfo}
              setActiveTab={setActiveTab}
              windowWidth={props.windowWidth}
              openMenu={openMenu}
            />
          )}
        />
      </div>
    </div>
  );
};

export default Settings;
