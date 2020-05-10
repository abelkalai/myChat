import React, { Fragment, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { EDIT_IMAGE, GET_PROFILE_PICTURE } from "GraphqlDocuments/userDocs";
import imageCompression from "browser-image-compression";

const EditPicture = (props) => {
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [editImage] = useMutation(EDIT_IMAGE, {
    update: (store, { data }) => {
      store.writeQuery({
        query: GET_PROFILE_PICTURE,
        variables: { _id: props.userInfo._id },
        data: { getProfilePicture: data.editImage },
      });
    },
  });

  const uploadFileEvent = async (event) => {
    event.preventDefault();
    if (uploadFile) {
      const compressedFile = await imageCompression(uploadFile, {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 1920,
      });
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onload = async () => {
        const _id = props.userInfo._id;
        const result = await reader.result;
        const image = result.substring(result.indexOf(",") + 1);
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
      <div id="upload-file-container">
        <input
          type="file"
          id="input-file"
          onChange={() => {
            setUploadFile(event.target.files[0]);
          }}
        />
        <label id="file-upload-label" htmlFor="input-file">
          <img src="images/upload.png" />
          <span>Upload Profile Picture</span>
        </label>
      </div>
      <div>
        <button
          type="button"
          className="change-button"
          onClick={uploadFileEvent}
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
    </Fragment>
  );
};

export default EditPicture;
