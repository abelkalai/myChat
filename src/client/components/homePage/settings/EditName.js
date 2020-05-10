import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { useFieldInput } from "Utilities/customHooks";
import { CHANGE_NAME } from "GraphqlDocuments/userDocs";

const EditName = (props) => {
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [changeName] = useMutation(CHANGE_NAME);
  const firstNamefield = useFieldInput(props.userInfo.firstName);
  const lastNameField = useFieldInput(props.userInfo.lastName);

  const submitNameForm = async (event) => {
    event.preventDefault();
    const _id = props.userInfo._id;
    const firstName = firstNamefield.value;
    const lastName = lastNameField.value;
    const changeNameResult = await changeName({
      variables: { _id, firstName, lastName },
    });
    setErrors(changeNameResult.data.changeName);
    if (changeNameResult.data.changeName.length === 0) {
      props.setUserInfo({
        ...props.userInfo,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
      });
      setSuccess(true);
      setTimeout(()=>{setSuccess(false)},2000)
    }
  };

  return (
    <form className="settings-form" onSubmit={submitNameForm}>
      {success ? (
        <div className="success">Name Change Successful!</div>
      ) : null}
      {errors.length > 0
        ? errors.map((error) => (
            <div key={error}>
              <span className="error">{error}</span>
            </div>
          ))
        : null}
      <div>
        <label className="settings-form-label"> First Name</label>
        <input
          required
          value={firstNamefield.value}
          onChange={firstNamefield.onChange}
        />
      </div>
      <div>
        <label className="settings-form-label"> Last Name</label>
        <input
          required
          value={lastNameField.value}
          onChange={lastNameField.onChange}
        />
      </div>
      <div>
        <button className="change-button" type="submit">
          Save
        </button>
        <button
          className="cancel-button"
          type="button"
          onClick={() => {
            props.setShowNameForm(false);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditName;
