import React, { Fragment, useState, useEffect } from "react";
import EditName from "./editSettings/EditName";
import EditUsername from "./editSettings/EditUsername";
import "MainStylesheets/settings.css";

const General = (props) => {
  const [showNameForm, setShowNameForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  useEffect(() => {
    props.setActiveTab("general");
  }, []);

  return props.windowWidth > 950 || !props.openMenu ? (
    <Fragment>
      <div className="settings-divider-container">
        <h1>General Settings</h1>
      </div>
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
      <div className="settings-divider-inside-single-flex">
        <span className="bold-text">Email </span>
        <div className="settings-info">{props.userInfo.email}</div>
      </div>
    </Fragment>
  ) : null;
};

export default General;
