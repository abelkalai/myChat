import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const EDIT_ABOUT = gql`
  mutation editAbout($_id: String!, $about: String!) {
    editAbout(_id: $_id, about: $about)
  }
`;
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
  const aboutEventHandler = async (event) => {
    event.preventDefault();
    let _id = props.userInfo._id;
    let about = props.aboutField.value;
    await editAbout({ variables: { _id, about } });
    props.setShowAboutForm(false);
  };

  return (
    <form onSubmit={aboutEventHandler}>
      <textarea
        id="editAbout"
        maxLength="850"
        className="about-text-area"
        value={props.aboutField.value}
        onChange={props.aboutField.onChange}
      />
      <div className="profile-button-container">
        <button className="change-button" type="submit">
          Save Changes
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
