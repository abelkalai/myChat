import React, { useState } from "react";
import {EDIT_IMAGE, GET_IMAGE} from "../../../../../graphqlDocuments/user"
import { useMutation } from "@apollo/react-hooks";
import imageCompression from "browser-image-compression";

const EditPicture = (props) => {
  const [uploadFile, setUploadFile] = useState(null);
  const [editImage] = useMutation(EDIT_IMAGE, {
    update: (store, { data }) => {
      store.writeQuery({
        query: GET_IMAGE,
        variables: { _id: props.userInfo._id },
        data: { getImage: data.editImage },
      });
    },
  });

  const uploadFileEventHandler = async (event) => {
    event.preventDefault();
    if (!uploadFile) return;
    let newFile = await await imageCompression(uploadFile, {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1920,
    });
    const reader = new FileReader();
    reader.readAsDataURL(newFile);
    reader.onload = async () => {
      let _id = props.userInfo._id;
      let result = await reader.result;
      let image = result.substring(result.indexOf(",") + 1);
      await editImage({ variables: { _id, image } });
    };
    props.setShowUploadForm(false);
  };

  return (
    <div>
      <div className= "profile-upload-input-div">
        <input
        
          type="file"
          onChange={() => {
            setUploadFile(event.target.files[0]);
          }}
        />
      </div>
      <div>
        <div className="profile-button-container">
          <button
            type="button"
            className="change-button"
            onClick={uploadFileEventHandler}
          >
            Upload Profile Picture
          </button>

          <button
            className="cancel-button"
            type="button"
            onClick={() => {
              props.setShowUploadForm(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPicture;
