import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { fieldInput } from "../../../hooks/customHooks";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $_id: String!
    $password: String!
  ) {
    changePassword(
      _id: $_id
      password: $password
    ) 
  }
`;

const Security = props => {
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const newPassword = fieldInput();
  const newPasswordConfirm = fieldInput();
  const [passwordError, setPasswordError] = useState(null);
  const [sendHome, setSendHome] = useState(false);

  const changePasswordCallBack = async event => {
    event.preventDefault();
    if (newPassword.value != newPasswordConfirm.value) {
      setPasswordError("Passwords do not match");
      return;
    }
    let password = newPassword.value;
    let _id = props.userInfo._id;
    await changePassword({ variables: { _id, password } });
    props.setIgnoreCookie(true);
    document.cookie = "token=;expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    setSendHome(true);
  };

  return (
    <div className="main-right">
      {sendHome && <Redirect to="/" />}
      <h1>Security </h1>
      <div>
        Change Password (You'll be required to re-login upon changing your
        password)
      </div>
      <form onSubmit={changePasswordCallBack} className="form">
        <div>
          <label> New Password</label>
          <input
            type="password"
            value={newPassword.value}
            onChange={newPassword.onChange}
          />
          {<span className="error">{passwordError}</span>}
        </div>
        <div>
          <label> Confirm New Password</label>
          <input
            type="password"
            value={newPasswordConfirm.value}
            onChange={newPasswordConfirm.onChange}
          />
          {<span className="error">{passwordError}</span>}
        </div>
        <div>
          <button type="submit"> Change Password</button>
        </div>
      </form>
      <div>
        Make sure you change your password if you used recently forgot password.
      </div>
    </div>
  );
};

export default Security;
