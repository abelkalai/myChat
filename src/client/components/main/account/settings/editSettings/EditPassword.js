import React, { useState } from "react";
import { useFieldInput } from "../../../../hooks/customHooks";
import { useMutation } from "@apollo/react-hooks";
import { CHANGE_PASSWORD } from "../../../../../graphqlDocuments/user";

const EditPassword = (props) => {
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const currentPasswordField = useFieldInput("");
  const newPasswordField = useFieldInput("");
  const newPasswordConfirmField = useFieldInput("");
  const [currentPasswordError, setCurrentPasswordError] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);

  const changePasswordCallBack = async (event) => {
    event.preventDefault();
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
      setTimeout(() => {
        props.setActiveUser(null);
        props.setIgnoreCookie(true),
          (document.cookie =
            "token=;expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;"),
          setSendHome(true);
      }, 150);
    }
  };

  return (
    <form className="settings-form" onSubmit={changePasswordCallBack}>
      <div>
        <label className="label-settings-form"> Current Password</label>
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
        <label className="label-settings-form"> New Password</label>
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
        <label className="label-settings-form"> Confirm New Password</label>
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
