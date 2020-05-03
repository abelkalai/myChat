import React, { useState, useEffect } from "react";
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
      <div
        className={
          !showNameForm
            ? "settings-divider-inside-flex"
            : "settings-divider-inside"
        }
      >
        <span className="bold-text">Name </span>
        {!showNameForm ? (
          <div className="settings-info">{props.userInfo.fullName} </div>
        ) : null}
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
      <div
        className={
          !showUserForm
            ? "settings-divider-inside-flex"
            : "settings-divider-inside"
        }
      >
        <span className="bold-text"> Username </span>

        {!showUserForm ? (
          <span className="settings-info">{props.userInfo.username}</span>
        ) : null}
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
    <div className="settings-general-id">
      <div className="settings-divider-container">
        <h1>General Settings</h1>
      </div>
      {nameSection()}
      {usernameSection()}
      <div className="settings-divider-inside-single-flex">
        <span className="bold-text">Email </span>
        <div className="settings-info">{props.userInfo.email}</div>
      </div>
    </div>
  );
};

export default General;
