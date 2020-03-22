import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { fieldInput } from "../../../hooks/customHooks";
import { gql } from "apollo-boost";
import "../../../../assets/stylesheets/components/main/profile.css";

const EDIT_ABOUT = gql`
  mutation editAbout($_id: String!, $about: String!) {
    editAbout(_id: $_id, about: $about)
  }
`;

const Profile = props => {
  console.log(props.userInfo)
  const [editAbout] = useMutation(EDIT_ABOUT);
  const [showAbout, setShowAbout] = useState(false);
  const aboutField = fieldInput();
  document.title = "Profile | MyChat";

  const aboutForm = () => {
    return (
      <form onSubmit={changeAbout}>
        <input
          className="about-input"
          placeholder="Write about yourself..."
          value={aboutField.value}
          onChange={aboutField.onChange}
        />
        <button type="submit"> Save Changes</button>
      </form>
    );
  };

  const changeAbout = async event => {
    event.preventDefault();
    let _id = props.userInfo._id;
    let about = aboutField.value;
    await editAbout({ variables: { _id, about } });
    props.setUserInfo({ ...props.userInfo, about });
    aboutField.clear();
  };

  return (
    <div className="profile-main">
      <h1>{`${props.userInfo.firstName}  ${props.userInfo.lastName}`}</h1>
      <div>About</div>
      <button
        type="button"
        className="about-button"
        onClick={() => {
          setShowAbout(!showAbout);
        }}
      >
        {!showAbout ? "Edit" : "Close"}
      </button>
      <div>{`${props.userInfo.about}`}</div>
      {showAbout && aboutForm()}
    </div>
  );
};

export default Profile;
