import React, { useState } from "react";
import { fieldInput } from "../../../hooks/customHooks";

const Security = props => {
  const [passwordError, setPasswordError] = useState(null);
  const oldPassword = fieldInput();
  const newPassword = fieldInput();
  const newPasswordConfirm = fieldInput();
  const changedPassword = fieldInput();

  const changePassword = event => {
    event.preventDefault();
  };

  return (
    <div className="main-right">
      <h1>Security </h1>
      <div>Change Password</div>
      <form onSubmit={changePassword} className="form">
        <div>
          <label>Current Passoword</label>
          <input />
        </div>
        <div>
          <label> New Password</label>
          <input />
        </div>
        <div>
          <label> Confirm New Password</label>
          <input />
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
