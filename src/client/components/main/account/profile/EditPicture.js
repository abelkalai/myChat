import React, { Fragment, useState } from "react";
import { EDIT_IMAGE, GET_PROFILE_PICTURE } from "GraphqlDocuments/userDocs";
import { useMutation } from "@apollo/react-hooks";
import imageCompression from "browser-image-compression";

const EditPicture = (props) => {
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [editImage] = useMutation(EDIT_IMAGE, {
    update: (store, { data }) => {
      store.writeQuery({
        query: GET_PROFILE_PICTURE,
        variables: { _id: props.userInfo._id },
        data: { getImage: data.editImage },
      });
    },
  });

  const uploadFileEventHandler = async (event) => {
    event.preventDefault();
    if (uploadFile) {
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
    } else {
      setUploadError("No file chosen");
    }
  };

  return (
    <Fragment>
      {uploadError ? <h2 className="error">{uploadError}</h2> : null}
      <div className="profile-upload-input-div">
        <input
          type="file"
          name="file"
          id="file"
          className="inputfile"
          onChange={() => {
            setUploadFile(event.target.files[0]);
          }}
        />
        <label className="file-upload-label" htmlFor="file">
          <img src="images/upload.png" />
          <span>Upload Profile Picture</span>
        </label>
      </div>
      <div>
        <div className="profile-button-container">
          <button
            type="button"
            className="change-button"
            onClick={uploadFileEventHandler}
          >
            Save
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
    </Fragment>
  );
};

export default EditPicture;
