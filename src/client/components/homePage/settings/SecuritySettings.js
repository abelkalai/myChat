import React, { Fragment, useState, useEffect } from "react";
import EditPassword from "./EditPassword";
import "HomePageStylesheets/settings.css";

const SecuritySettings = (props) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  useEffect(() => {
    props.setActiveTab("security");
  }, []);

  return props.windowWidth > 950 || !props.openHamMenu ? (
    <Fragment>
      <div className="settings-header">
        <h1>Security </h1>
      </div>
      <div
        className={
          !showPasswordForm
            ? "settings-last-section-flex"
            : "settings-last-section"
        }
      >
        <span className="bold-text">Change Password </span>
        {showPasswordForm ? null : (
          <span
            className="edit-button"
            onClick={() => {
              setShowPasswordForm(true);
            }}
          >
            Edit
          </span>
        )}
        {showPasswordForm && (
          <EditPassword
            userInfo={props.userInfo}
            setActiveUser={props.setActiveUser}
            setIgnoreCookie={props.setIgnoreCookie}
            setShowPasswordForm={setShowPasswordForm}
          />
        )}
      </div>
    </Fragment>
  ) : null;
};

export default SecuritySettings;
