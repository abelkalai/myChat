import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { fieldInput } from "../../../hooks/customHooks";
import { gql } from "apollo-boost";
import "../../../../assets/stylesheets/components/main/profile.css";

const EDIT_ABOUT = gql`
  mutation editAbout($_id: String!, $about: String!) {
    editAbout(_id: $_id, about: $about)
  }
`;

const GET_USER_DETAILS = gql`
  query getUserDetails($_id: String!) {
    getUserDetails(_id: $_id) {
      about
      profilePicture
    }
  }
`;

const Profile = props => {
  const [_id] = useState(props.userInfo._id);
  const userDetails = useQuery(GET_USER_DETAILS, { variables: { _id: _id } });
  const [editAbout] = useMutation(EDIT_ABOUT, {
    refetchQueries: [{ query: GET_USER_DETAILS, variables: { _id: _id } }]
  });
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
    !userDetails.loading && (
      <div className="profile-main">
        <h1>{`${props.userInfo.firstName}  ${props.userInfo.lastName}`}</h1>
        <img
          src={`data:image/png;base64,${userDetails.data.getUserDetails.profilePicture}`}
        />
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
        <div> {userDetails.data.getUserDetails.about} </div>
        {showAbout && aboutForm()}
      </div>
    )
  );
};

export default Profile;
