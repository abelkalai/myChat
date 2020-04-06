import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useFieldInput } from "../../../hooks/customHooks";
import { gql } from "apollo-boost";
import imageCompression from "browser-image-compression";
import "../../../../assets/stylesheets/components/main/profile.css";

const GET_ABOUT = gql`
  query getAbout($_id: String!) {
    getAbout(_id: $_id)
  }
`;

const EDIT_ABOUT = gql`
  mutation editAbout($_id: String!, $about: String!) {
    editAbout(_id: $_id, about: $about)
  }
`;

const EDIT_IMAGE = gql`
  mutation editImage($_id: String!, $image: String!) {
    editImage(_id: $_id, image: $image)
  }
`;

const Profile = (props) => {
  document.title = "Profile | MyChat";
  const aboutUser = useQuery(GET_ABOUT, { variables: { _id: props.userInfo._id } });

  const [editAbout] = useMutation(EDIT_ABOUT, {
    update: (store, { data }) => {
      store.writeQuery({
        query: GET_ABOUT,
        variables: { _id: props.userInfo._id },
        data: {"getAbout": data.editAbout}
      })
    }
  });
  const [editImage] = useMutation(EDIT_IMAGE, {
    update: (store, { data }) => {
      store.writeQuery({
        query: props.getImage,
        variables: { _id: props.userInfo._id },
        data: {"getImage": data.editImage}
      })
    }
  });
  const [showAbout, setShowAbout] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const aboutField = useFieldInput()

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

  const changeAbout = async (event) => {
    event.preventDefault();
    let _id = props.userInfo._id;
    let about = aboutField.value;
    await editAbout({ variables: { _id, about } });
    props.setUserInfo({ ...props.userInfo, about });
    aboutField.clear();
  };

  const compressImage = async (file) => {
    let options = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1920,
    };
    let result = await imageCompression(file, options);
    return result;
  };

  const uploadFileHandler = async (event) => {
    event.preventDefault();
    if (uploadFile === null) return;
    let newFile = await compressImage(uploadFile);
    const reader = new FileReader();
    reader.readAsDataURL(newFile);
    reader.onload = async () => {
      let _id = props.userInfo._id;
      let result = await reader.result;
      let image = result.substring(result.indexOf(",") + 1);
      await editImage({ variables: { _id, image } });
    };
  };

  return (
    !aboutUser.loading && (
      <div className="profile-main">
        <h1>{props.userInfo.fullName}</h1>
        <img
          className="profile-image"
          src={`data:image/png;base64,${props.userImage.data.getImage}`}
        />
        <div>Upload .jpeg and .png only | About</div>
        <input
          type="file"
          onChange={() => {
            setUploadFile(event.target.files[0]);
          }}
        />
        <button
          type="button"
          className="about-button"
          onClick={uploadFileHandler}
        >
          Upload Profile Picture
        </button>
        <button
          type="button"
          className="about-button"
          onClick={() => {
            setShowAbout(!showAbout);
          }}
        >
          {!showAbout ? "Edit" : "Close"}
        </button>
        <div> {aboutUser.data.getAbout} </div>
        {showAbout && aboutForm()}
      </div>
    )
  );
};

export default Profile;
