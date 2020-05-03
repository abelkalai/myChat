import React, { useState, useEffect } from "react";
import EditPassword from "./editSettings/EditPassword";
import "MainStylesheets/settings.css";

const Security = (props) => {
  useEffect(() => {
    props.setActiveTab("security");
  }, []);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [sendHome, setSendHome] = useState(false);

  return (
    <div>
      {sendHome && <Redirect to="/" />}
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
            setSendHome={setSendHome}
            userInfo={props.userInfo}
            setActiveUser={props.setActiveUser}
            setIgnoreCookie={props.setIgnoreCookie}
            setShowPasswordForm={setShowPasswordForm}
          />
        )}
      </div>
    </div>
  );
};

export default Security;
