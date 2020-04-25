import React, { useState, useEffect} from "react";
import EditName from "./editSettings/EditName";
import EditUsername from "./editSettings/EditUsername";
import "../../../../assets/stylesheets/components/main/settings.css";

const General = (props) => {
  const [showNameForm, setShowNameForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  useEffect(() => {
    props.setActiveTab("general");
  }, []);

  const nameSection = () => {
    return (
      <div className="settings-divider-inside">
        <span className="bold-text">Name </span>
        {!showNameForm ? `${props.userInfo.fullName}` : null}
        {!showNameForm ? (
          <span
            className="change"
            onClick={() => {
              setShowNameForm(true);
            }}
          >
            Edit
          </span>
        ) : null}
        {showNameForm && (
          <EditName
            userInfo={props.userInfo}
            setUserInfo={props.setUserInfo}
            setShowNameForm={setShowNameForm}
          />
        )}
      </div>
    );
  };

  const usernameSection = () => {
    return (
      <div className="settings-divider-inside">
        <span className="bold-text"> Username </span>
        {`${props.userInfo.username}`}
        {!showUserForm ? (
          <span
            className="change"
            onClick={() => {
              setShowUserForm(true);
            }}
          >
            Edit
          </span>
        ) : null}
        {showUserForm && (
          <EditUsername
            userInfo={props.userInfo}
            setUserInfo={props.setUserInfo}
            setShowUserForm={setShowUserForm}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <h1 className="settings-divider-container">General Settings</h1>
      {nameSection()}
      {usernameSection()}
      <div className="settings-divider-inside-single">
        <span className="bold-text">Email </span> {`${props.userInfo.email}`}
      </div>
    </div>
  );
};

export default General;
