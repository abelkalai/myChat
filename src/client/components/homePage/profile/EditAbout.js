import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { EDIT_ABOUT } from "GraphqlDocuments/userDocs";

const EditAbout = (props) => {
  const [editAbout] = useMutation(EDIT_ABOUT, {
    update: (store, { data }) => {
      store.writeQuery({
        query: props.getAbout,
        variables: { _id: props.userInfo._id },
        data: { getAbout: data.editAbout },
      });
    },
  });

  const aboutFormSubmit = async (event) => {
    event.preventDefault();
    const _id = props.userInfo._id;
    const about = props.aboutField.value;
    await editAbout({ variables: { _id, about } });
    props.setShowAboutForm(false);
  };

  return (
    <form onSubmit={aboutFormSubmit}>
      <textarea
        id="profile-about-text-area"
        value={props.aboutField.value}
        onChange={props.aboutField.onChange}
        autoComplete="off"
      />
      <div>
        <button className="change-button" type="submit">
          Save
        </button>
        <button
          className="cancel-button"
          type="button"
          onClick={() => {
            props.setShowAboutForm(false);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditAbout;
