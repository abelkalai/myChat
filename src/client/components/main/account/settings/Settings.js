import React, { useState } from "react";
import General from "./General";
import Security from "./Security";
import { Link, Route } from "react-router-dom";
import "../../../../assets/stylesheets/components/main/settings.css";

const Settings = (props) => {
  document.title = "Settings | MyChat";
  const [activeTab, setActiveTab] = useState(null);
  return (
    <div className="main-settings">
      <div className="main-left">
        <h1>Settings</h1>
        <div className="settings-dropdown">
          <Link to={`/home/settings/general`} className="link">
            <div
              className={
                activeTab === "general" ? "settings-active-tab" : "settings-tab"
              }
            >
              <img
                className="general-settings-image"
                src="../../../../assets/images/generalSettings.png"
              />
              <span className="general-content">General</span>
            </div>
          </Link>
          <Link to={`/home/settings/security`} className="link">
            <div
              className={
                activeTab === "security"
                  ? "settings-active-tab"
                  : "settings-tab"
              }
            >
              <img
                className="security-settings-image"
                src="../../../../assets/images/securitySettings.png"
              />
              <span className="security-content">Security </span>
            </div>
          </Link>
        </div>
      </div>
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
          <Security
            userInfo={props.userInfo}
            setIgnoreCookie={props.setIgnoreCookie}
            setActiveUser={props.setActiveUser}
            setActiveTab={setActiveTab}
          />
        )}
      />
    </div>
  );
};

export default Settings;
