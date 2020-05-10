import React, { useState } from "react";
import { useFieldInput } from "Utilities/customHooks";
import { useMutation } from "@apollo/react-hooks";
import { CHANGE_USERNAME } from "GraphqlDocuments/userDocs";

const EditUsername = (props) => {
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const userField = useFieldInput(props.userInfo.username);
  const [changeUserName] = useMutation(CHANGE_USERNAME);
  
  const submitUserForm = async (event) => {
    event.preventDefault();
     const _id = props.userInfo._id;
     const username = userField.value.trim();
     const changeUserResult = await changeUserName({
      variables: { _id, username },
    });
    setErrors(changeUserResult.data.changeUserName);
    if (changeUserResult.data.changeUserName.length === 0) {
      props.setUserInfo({
        ...props.userInfo,
        username,
      });
      setSuccess(true)
      setTimeout(()=>{setSuccess(false)},2000)
    }
  };

  return (
    <form className="settings-form" onSubmit={submitUserForm}>
      {success ? <div className="success">Username Change Successful!</div> : null}
      {errors.length > 0
        ? errors.map((error) => (
            <div key={error}>
              <span className="error">{error}</span>
            </div>
          ))
        : null}
      <div>
        <label className="settings-form-label"> Username</label>
        <input
          required
          value={userField.value}
          onChange={userField.onChange}
        />
      </div>
      <div>
        <button className="change-button" type="submit">
          Save
        </button>
        <button
          className="cancel-button"
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
