import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { useFieldInput } from "Utilities/customHooks";
import { CHANGE_PASSWORD } from "GraphqlDocuments/userDocs";

const EditPassword = (props) => {
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const currentPasswordField = useFieldInput("");
  const newPasswordField = useFieldInput("");
  const newPasswordConfirmField = useFieldInput("");

  const submitPasswordForm = async (event) => {
    event.preventDefault();
    setSuccess(false);
    const _id = props.userInfo._id;
    const currentPassword = currentPasswordField.value;
    const newPassword = newPasswordField.value;
    const newPasswordConfirm = newPasswordConfirmField.value;
    const changePassworedResult = await changePassword({
      variables: { _id, currentPassword, newPassword, newPasswordConfirm },
    });

    setErrors(changePassworedResult.data.changePassword);
    if (changePassworedResult.data.changePassword.length === 0) {
      currentPasswordField.clear();
      newPasswordField.clear();
      newPasswordConfirmField.clear();
      setSuccess(true);
    }
  };

  return (
    <form className="settings-form" onSubmit={submitPasswordForm}>
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
        <label className="settings-form-password-label">
          <span>Current Password</span>
        </label>
        <input
          required
          type="password"
          value={currentPasswordField.value}
          onChange={currentPasswordField.onChange}
        />
      </div>
      <div>
        <label className="settings-form-password-label">
          <span> New Password </span>
        </label>
        <input
          required
          type="password"
          value={newPasswordField.value}
          onChange={newPasswordField.onChange}
        />
      </div>
      <div>
        <label className="settings-form-password-label">
          <span>Confirm New Password</span>
        </label>
        <input
          required
          type="password"
          value={newPasswordConfirmField.value}
          onChange={newPasswordConfirmField.onChange}
        />
      </div>
      <div>
        <button className="change-button" type="submit">
          Save
        </button>
        <button
          className="cancel-button"
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
