import React, { Fragment, useState, useEffect } from "react";
import EditName from "./EditName";
import EditUsername from "./EditUsername";
import "HomePageStylesheets/settings.css";

const GeneralSettings = (props) => {
  const [showNameForm, setShowNameForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  useEffect(() => {
    props.setActiveTab("general");
  }, []);

  return props.windowWidth > 950 || !props.openHamMenu ? (
    <Fragment>
      <div className="settings-header">
        <h1>General Settings</h1>
      </div>
      <div
        className={
          !showUserForm
          ? "settings-section-flex"
          : "settings-section"
        }
      >
        <span className="bold-text"> Username </span>

        {!showUserForm ? (
          <span className="settings-user-info">{props.userInfo.username}</span>
        ) : null}
        {!showUserForm ? (
          <span
            className="edit-button"
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
            ? "settings-section-flex"
            : "settings-section"
        }
      >
        <span className="bold-text">Name </span>
        {!showNameForm ? (
          <div className="settings-user-info">{props.userInfo.fullName} </div>
        ) : null}
        {!showNameForm ? (
          <span
            className="edit-button"
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
      <div className="settings-last-section-flex">
        <span className="bold-text">Email </span>
        <div className="settings-user-info ">{props.userInfo.email}</div>
      </div>
    </Fragment>
  ) : null;
};

export default GeneralSettings;
