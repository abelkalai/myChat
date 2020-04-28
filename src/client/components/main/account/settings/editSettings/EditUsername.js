import React, { useState } from "react";
import { useFieldInput } from "Hooks/customHooks";
import { useMutation } from "@apollo/react-hooks";
import { CHANGE_USERNAME } from "GraphqlDocuments/user";

const EditUsername = (props) => {
  const [changeUserName] = useMutation(CHANGE_USERNAME);
  const userField = useFieldInput(props.userInfo.username);
  const [errors, setErrors] = useState([]);

  const changeUserCallBack = async (event) => {
    event.preventDefault();
    let _id = props.userInfo._id;
    let username = userField.value;
    let result = await changeUserName({
      variables: { _id, username },
    });
    setErrors(result.data.changeUserName);
    if (result.data.changeUserName.length === 0) {
      props.setUserInfo({
        ...props.userInfo,
        username,
      });
    }
  };

  return (
    <form className="settings-form" onSubmit={changeUserCallBack}>
      {errors.length > 0
        ? errors.map((error) => (
            <div key={error}>
              <span className="error">{error}</span>
            </div>
          ))
        : null}
      <div>
        <label className="label-settings-form"> Username</label>
        <input
          className="input-settings-form"
          required
          value={userField.value}
          onChange={userField.onChange}
        />
      </div>
      <div>
        <button className="settings-save-changes" type="submit">
          Save Changes
        </button>
        <button
          className="settings-cancel-changes"
          onClick={() => {
            props.setShowUserForm(false);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditUsername;
