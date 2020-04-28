import React, { useState } from "react";
import { useFieldInput } from "Hooks/customHooks";
import { useMutation } from "@apollo/react-hooks";
import { CHANGE_PASSWORD } from "GraphqlDocuments/user";

const EditPassword = (props) => {
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const currentPasswordField = useFieldInput("");
  const newPasswordField = useFieldInput("");
  const newPasswordConfirmField = useFieldInput("");
  const [currentPasswordError, setCurrentPasswordError] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);
  const [success, setSuccess] = useState(false);

  const changePasswordCallBack = async (event) => {
    event.preventDefault();
    setSuccess(false);
    if (newPasswordField.value != newPasswordConfirmField.value) {
      setNewPasswordError("Passwords do not match");
      return;
    }

    let _id = props.userInfo._id;
    let currentPassword = currentPasswordField.value;
    let newPassword = newPasswordField.value;
    let result = await changePassword({
      variables: { _id, currentPassword, newPassword },
    });

    setCurrentPasswordError(result.data.changePassword[0]);
    setNewPasswordError(result.data.changePassword[1]);
    if (!result.data.changePassword[0] && !result.data.changePassword[1]) {
      setSuccess(true);
      currentPasswordField.clear();
      newPasswordField.clear();
      newPasswordConfirmField.clear();
    }
  };

  return (
    <form className="settings-form" onSubmit={changePasswordCallBack}>
      {success ? (
        <div className="success">Password Change Successful!</div>
      ) : null}
      <div>
        <label className="label-settings-form-password">
          <span>Current Password</span>
        </label>
        <input
          className="input-settings-form "
          required
          type="password"
          value={currentPasswordField.value}
          onChange={currentPasswordField.onChange}
        />
        {<span className="error">{currentPasswordError}</span>}
      </div>
      <div>
        <label className="label-settings-form-password">
          <span> New Password </span>
        </label>
        <input
          className="input-settings-form "
          required
          type="password"
          value={newPasswordField.value}
          onChange={newPasswordField.onChange}
        />
        {newPasswordError ? (
          <span className="error">{newPasswordError}</span>
        ) : null}
      </div>
      <div>
        <label className="label-settings-form-password">
          {" "}
          <span>Confirm New Password</span>
        </label>
        <input
          className="input-settings-form "
          required
          type="password"
          value={newPasswordConfirmField.value}
          onChange={newPasswordConfirmField.onChange}
        />
        {newPasswordError ? (
          <span className="error">{newPasswordError}</span>
        ) : null}
      </div>
      <div>
        <button className="settings-save-changes" type="submit">
          Save Changes
        </button>
        <button
          className="settings-cancel-changes"
          onClick={() => {
            props.setShowPasswordForm(false);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditPassword;
