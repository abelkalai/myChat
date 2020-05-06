import React, { Fragment, useState, useEffect } from "react";
import EditPassword from "./EditPassword";
import "MainStylesheets/settings.css";

const Security = (props) => {
  useEffect(() => {
    props.setActiveTab("security");
  }, []);

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return props.windowWidth > 950 || !props.openMenu ? (
    <Fragment>
      <div className="settings-divider-container">
        <h1>Security </h1>
      </div>
      <div className="settings-divider-inside-single">
        <span className="bold-text">Change Password </span>
        {showPasswordForm ? null : (
          <span
            className="change-edit-password"
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

export default Security;
