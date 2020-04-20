import React, { useState } from "react";
import { useFieldInput } from "../../../../hooks/customHooks";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const CHANGE_USERNAME = gql`
  mutation changeUserName($_id: String!, $username: String!) {
    changeUserName(_id: $_id, username: $username)
  }
`;

const EditUsername = (props) => {
  const [changeUserName] = useMutation(CHANGE_USERNAME);
  const userField = useFieldInput(props.userInfo.username);
  const [userError, setUserError] = useState(null);

  const changeUserCallBack = async (event) => {
    event.preventDefault();
    if (userField.value === props.userInfo.username) {
      setUserError("You're currently using this username");
      return;
    }
    let _id = props.userInfo._id;
    let username = userField.value;
    let result = await changeUserName({
      variables: { _id, username },
    });
    if (result.data.changeUserName != "Success") {
      setUserError(result.data.changeUserName);
      return;
    }
    setUserError(null);
    props.setUserInfo({
      ...props.userInfo,
      username,
    });
  };

  return (
    <form className="settings-form" onSubmit={changeUserCallBack}>
      <div>
        <label className="label-settings-form"> Username</label>
        <input
          className="input-settings-form"
          required
          value={userField.value}
          onChange={userField.onChange}
        />
        {userError ?<span className="error">{userError}</span> : null}
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
