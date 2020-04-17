import React, { useState, useEffect } from "react";
import EditPassword from "./editInfo/EditPassword";
import "../../../../assets/stylesheets/components/main/settings.css";

const Security = (props) => {
  useEffect(() => {
    props.setActiveTab("security");
  }, []);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [sendHome, setSendHome] = useState(false);

  return (
    <div className="main-right">
      {sendHome && <Redirect to="/" />}
      <h1 className="settings-divider-container">Security </h1>
      <div className="settings-divider-inside-single">
        <span className="bold-text">Change Password </span>(You'll be required to re-login upon changing your
        password)
        {!showPasswordForm ? (
          <span
            className="change"
            onClick={() => {
              setShowPasswordForm(true);
            }}
          >
            Edit
          </span>
        ) : null}
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
