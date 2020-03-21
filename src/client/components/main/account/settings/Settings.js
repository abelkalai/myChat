import React from "react";
import General from "./General";
import Security from "./Security";
import { Link, Route } from "react-router-dom";
import "../../../../assets/stylesheets/components/main/settings.css";


const Settings = props => {
  document.title="Settings | MyChat"
  return (
    <div className="main">
      <div className="main-left">
        <h1>Settings</h1>
        <div className="settings-dropdown">
          <Link to={`/home/settings/general`} className="link">
            <div className="settings-dropdown-general">
              <span className="settings-dropdown-general-content">General</span>
            </div>
          </Link>
          <Link to={`/home/settings/security`} className="link">
            <div className="settings-dropdown-security">
              <span className="settings-dropdown-security-content">
                Security
              </span>
            </div>
          </Link>
        </div>
      </div>
      <Route
        path="/home/settings/general"
        render={() => (
          <General userInfo={props.userInfo} setUserInfo={props.setUserInfo} />
        )}
      />
      <Route
        path="/home/settings/security"
        render={() => (
          <Security
            userInfo={props.userInfo}
            setIgnoreCookie={props.setIgnoreCookie}
          />
        )}
      />
    </div>
  );
};

export default Settings;
