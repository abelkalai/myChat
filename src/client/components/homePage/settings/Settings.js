import React, { useState, useEffect } from "react";
import { NavLink, Route } from "react-router-dom";
import GeneralSettings from "./GeneralSettings";
import SecuritySettings from "./SecuritySettings";
import "HomePageStylesheets/settings.css";

const Settings = (props) => {
  const [activeTab, setActiveTab] = useState("general");
  const [openHamMenu, setOpenHamMenu] = useState(false);
  useEffect(() => {
    document.title = "Settings | MyChat";
  }, []);

  return (
    <div id="settings-page">
      {props.windowWidth <= 950 ? (
        <div
          id="settings-hamburger-menu"
          onClick={() => {
            setOpenHamMenu(!openHamMenu);
          }}
        >
          {openHamMenu ? (
            <img src="images/hamburgerMenuClose.png" />
          ) : (
            <img src="images/hamburgerMenuOpen.png" />
          )}
        </div>
      ) : null}
      {props.windowWidth > 950 || openHamMenu ? (
        <div id="settings-nav-container">
          <h1>Settings</h1>
          <div id="settings-nav">
            <div
              className={
                activeTab === "general" ? "settings-active-tab" : "settings-tab"
              }
              onClick={() => {
                setOpenHamMenu(false);
              }}
            >
              <NavLink
                to="/home/settings/general"
                className="nav-link"
                activeClassName="active-nav-link"
              >
                <img
                  className="settings-nav-image"
                  src="images/generalSettings.png"
                />
                <div className="settings-nav-text">General</div>
              </NavLink>
            </div>

            <div
              className={
                activeTab === "security"
                  ? "settings-active-tab"
                  : "settings-tab"
              }
              onClick={() => {
                setOpenHamMenu(false);
              }}
            >
              <NavLink
                to="/home/settings/security"
                className="nav-link"
                activeClassName="active-nav-link"
              >
                <img
                  className="settings-nav-image"
                  src="images/securitySettings.png"
                />
                <div className="settings-nav-text">Security </div>
              </NavLink>
            </div>
          </div>
        </div>
      ) : null}

      <div>
        <Route
          exact
          path={["/home/settings/general", "/home/settings/general/mobileMenu"]}
          render={() => (
            <GeneralSettings
              userInfo={props.userInfo}
              setUserInfo={props.setUserInfo}
              setActiveTab={setActiveTab}
              windowWidth={props.windowWidth}
              openHamMenu={openHamMenu}
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
            <SecuritySettings
              userInfo={props.userInfo}
              setActiveTab={setActiveTab}
              windowWidth={props.windowWidth}
              openHamMenu={openHamMenu}
            />
          )}
        />
      </div>
    </div>
  );
};

export default Settings;
