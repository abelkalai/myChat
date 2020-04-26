import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import {GET_ABOUT} from "../../../../graphqlDocuments/user"
import EditPicture from "./editProfile/EditPicture";
import EditAbout from "./editProfile/EditAbout";
import { useFieldInput } from "./../../../hooks/customHooks";
import "../../../../assets/stylesheets/components/main/profile.css";

const Profile = (props) => {
  document.title = "Profile | MyChat";
  const [showUploadForm, setShowUploadForm] = useState(null);
  const [showAboutForm, setShowAboutForm] = useState(false);
  const aboutField = useFieldInput("");
  const aboutUser = useQuery(GET_ABOUT, {
    variables: { _id: props.userInfo._id },
    onCompleted: (data) => {
      aboutField.manualChange(data.getAbout);
    },
  });

  return (
    <div className="profile-main">
      {props.userImage.loading ? (
        <img
          className="profile-image"
          src="../../../assets/images/profilePlaceholder.png"
        />
      ) : (
        <img
          alt={props.userInfo.fullName}
          className="profile-image"
          src={`data:image/png;base64,${props.userImage.data.getImage}`}
        />
      )}
      <h1>{props.userInfo.fullName}</h1>
      {!showUploadForm ? (
        <button
          className="update-profile-pic-button"
          onClick={() => {
            setShowUploadForm(true);
          }}
        >
          Update Profile Picture
        </button>
      ) : null}
      {showUploadForm && (
        <EditPicture
          userInfo={props.userInfo}
          setUserInfo={props.setUserInfo}
          setShowUploadForm={setShowUploadForm}
        />
      )}
      <h2>About</h2>
      {!showAboutForm ? (
        <button
          type="button"
          className="change-button"
          onClick={() => {
            setShowAboutForm(true);
          }}
        >
          Edit
        </button>
      ) : null}
      {aboutUser.loading ? (
        <img
          className="about-placeholder"
          src="../../../assets/images/aboutPlaceholder.png"
        />
      ) : (
        !showAboutForm && (
          <div className="profile-about-wrapper">{aboutUser.data.getAbout}</div>
        )
      )}
      {showAboutForm && (
        <EditAbout
          userInfo={props.userInfo}
          getAbout={GET_ABOUT}
          aboutField={aboutField}
          setShowAboutForm={setShowAboutForm}
        />
      )}
    </div>
  );
};

export default Profile;
