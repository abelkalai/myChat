import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { fieldInput } from "../../../hooks/customHooks";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import "../../../../assets/stylesheets/components/main/settings.css"

const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $_id: String!
    $currentPassword: String!
    $newPassword: String!
  ) {
    changePassword(
      _id: $_id
      currentPassword: $currentPassword
      newPassword: $newPassword
    )
  }
`;

const Security = props => {
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const currentPass = fieldInput();
  const newPass = fieldInput();
  const newPassConfirm = fieldInput();
  const [currentPasswordError, setCurrentPasswordError] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);
  const [sendHome, setSendHome] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const passwordForm = () => {
    return (
      <form onSubmit={changePasswordCallBack} className="form">
        <div>
          <label> Current Password</label>
          <input
            required
            type="password"
            value={currentPass.value}
            onChange={currentPass.onChange}
          />
          {<span className="error">{currentPasswordError}</span>}
        </div>
        <div>
          <label> New Password</label>
          <input
            required
            type="password"
            value={newPass.value}
            onChange={newPass.onChange}
          />
          {<span className="error">{newPasswordError}</span>}
        </div>
        <div>
          <label> Confirm New Password</label>
          <input
            required
            type="password"
            value={newPassConfirm.value}
            onChange={newPassConfirm.onChange}
          />
          {<span className="error">{newPasswordError}</span>}
        </div>
        <div>
          <button type="submit"> Save Changes </button>
        </div>
      </form>
    );
  };

  const changePasswordCallBack = async event => {
    event.preventDefault();
    if (newPass.value != newPassConfirm.value) {
      setNewPasswordError("Passwords do not match");
      return;
    }
    setNewPasswordError(null);
    let _id = props.userInfo._id;
    let currentPassword = currentPass.value;
    let newPassword = newPass.value;
    let result = await changePassword({
      variables: { _id, currentPassword, newPassword }
    });
    if (result.data.changePassword == "Incorrect Current password") {
      setCurrentPasswordError("Wrong Current Password");
      return;
    }
    setCurrentPasswordError(null);
    if (result.data.changePassword == "You're currently using this password") {
      setNewPasswordError("You're currently using this password");
      return;
    }
    setTimeout(() => {
      props.setActiveUser(null)
      props.setIgnoreCookie(true),
        (document.cookie =
          "token=;expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;"),
        setSendHome(true);
    }, 150);
  };

  return (
    <div className="main-right">
      {sendHome && <Redirect to="/" />}
      <h1>Security </h1>
      <div>
        Change Password (You'll be required to re-login upon changing your
        password)
        <button
          type="button"
          className="button"
          onClick={() => {
            setShowForm(!showForm);
          }}
        >
          {!showForm ? "Edit" : "Close"}
        </button>
      </div>
      {showForm && passwordForm()}
      <div>
        Make sure you change your password if you used recently forgot password.
      </div>
    </div>
  );
};

export default Security;
