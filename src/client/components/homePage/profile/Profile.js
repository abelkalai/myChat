import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { GET_ABOUT } from "GraphqlDocuments/userDocs";
import { useFieldInput } from "Utilities/customHooks";
import EditPicture from "./EditPicture";
import EditAbout from "./EditAbout";
import "HomePageStylesheets/profile.css";

const Profile = (props) => {
  const [showUploadForm, setShowUploadForm] = useState(null);
  const [showAboutForm, setShowAboutForm] = useState(false);
  const aboutUserQuery = useQuery(GET_ABOUT, {
    variables: { _id: props.userInfo._id },
    onCompleted: (data) => {
      aboutField.manualChange(data.getAbout);
    },
  });
  const aboutField = useFieldInput("");
  useEffect(() => {
    document.title = "Profile | MyChat";
  });

  return (
    <div id="profile-page">
      <img
        alt={props.userInfo.fullName}
        id="profile-image"
        src={
          props.userImage.loading
            ? "images/profilePlaceholder.png"
            : `data:image/png;base64,${props.userImage.data.getProfilePicture}`
        }
      />
      <h1 id="profile-name">{props.userInfo.fullName}</h1>
      {!showUploadForm ? (
        <button
          id="change-pic-button"
          onClick={() => {
            setShowUploadForm(true);
          }}
        >
          Change Profile Picture
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
      {aboutUserQuery.loading ? (
        <img id="profile-about-placeholder" src="images/aboutPlaceholder.png" />
      ) : (
        !showAboutForm && (
          <div id="profile-about-wrapper">{aboutUserQuery.data.getAbout}</div>
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
