import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { useFieldInput } from "Hooks/customHooks";
import { CHANGE_PASSWORD } from "GraphqlDocuments/userDocs";

const EditPassword = (props) => {
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const currentPasswordField = useFieldInput("");
  const newPasswordField = useFieldInput("");
  const newPasswordConfirmField = useFieldInput("");
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const changePasswordCallBack = async (event) => {
    event.preventDefault();
    setSuccess(false);

    let _id = props.userInfo._id;
    let currentPassword = currentPasswordField.value;
    let newPassword = newPasswordField.value;
    let newPasswordConfirm = newPasswordConfirmField.value;
    let result = await changePassword({
      variables: { _id, currentPassword, newPassword, newPasswordConfirm },
    });

    setErrors(result.data.changePassword);
    if (result.data.changePassword.length === 0) {
      currentPasswordField.clear();
      newPasswordField.clear();
      newPasswordConfirmField.clear();
      setSuccess(true);
      setTimeout(()=>{setSuccess(false)},2000)
    }
  };

  return (
    <form className="settings-form" onSubmit={changePasswordCallBack}>
      {success ? (
        <div className="success">Password Change Successful!</div>
      ) : null}
      {errors.length > 0
        ? errors.map((error) => (
            <div key={error}>
              <span className="error">
                {error}
              </span>
            </div>
          ))
        : null}
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
      </div>
      <div>
        <label className="label-settings-form-password">
          <span>Confirm New Password</span>
        </label>
        <input
          className="input-settings-form "
          required
          type="password"
          value={newPasswordConfirmField.value}
          onChange={newPasswordConfirmField.onChange}
        />
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
