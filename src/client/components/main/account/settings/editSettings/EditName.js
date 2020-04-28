import React, { useState } from "react";
import { useFieldInput } from "Hooks/customHooks";
import { useMutation } from "@apollo/react-hooks";
import { CHANGE_NAME } from "GraphqlDocuments/user";

const EditName = (props) => {
  const [changeName] = useMutation(CHANGE_NAME);
  const [errors, setErrors] = useState([]);
  const firstNamefield = useFieldInput(props.userInfo.firstName);
  const lastNameField = useFieldInput(props.userInfo.lastName);

  const changeNameCallBack = async (event) => {
    event.preventDefault();
    let _id = props.userInfo._id;
    let firstName = firstNamefield.value;
    let lastName = lastNameField.value;
    let result = await changeName({
      variables: { _id, firstName, lastName },
    });
    setErrors(result.data.changeName);
    if (result.data.changeName.length === 0) {
      props.setUserInfo({
        ...props.userInfo,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
      });
    }
  };

  return (
    <form className="settings-form" onSubmit={changeNameCallBack}>
      {errors.length > 0
        ? errors.map((error) => (
            <div key={error}>
              <span className="error">{error}</span>
            </div>
          ))
        : null}
      <div>
        <label className="label-settings-form"> First Name</label>
        <input
          className="input-settings-form"
          required
          value={firstNamefield.value}
          onChange={firstNamefield.onChange}
        />
      </div>
      <div>
        <label className="label-settings-form"> Last Name</label>
        <input
          className="input-settings-form"
          required
          value={lastNameField.value}
          onChange={lastNameField.onChange}
        />
      </div>
      <div>
        <button className="settings-save-changes" type="submit">
          Save Changes
        </button>
        <button
          className="settings-cancel-changes"
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
