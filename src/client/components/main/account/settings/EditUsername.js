import React, { useState } from "react";
import { useFieldInput } from "Hooks/customHooks";
import { useMutation } from "@apollo/react-hooks";
import { CHANGE_USERNAME } from "GraphqlDocuments/user";

const EditUsername = (props) => {
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const userField = useFieldInput(props.userInfo.username);
  const [changeUserName] = useMutation(CHANGE_USERNAME);
  
  const changeUserCallBack = async (event) => {
    event.preventDefault();
    let _id = props.userInfo._id;
    let username = userField.value.trim();
    let result = await changeUserName({
      variables: { _id, username },
    });
    setErrors(result.data.changeUserName);
    if (result.data.changeUserName.length === 0) {
      props.setUserInfo({
        ...props.userInfo,
        username,
      });
      setSuccess(true)
      setTimeout(()=>{setSuccess(false)},2000)
    }
  };

  return (
    <form className="settings-form" onSubmit={changeUserCallBack}>
      {success ? <div className="success">Username Change Successful!</div> : null}
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
