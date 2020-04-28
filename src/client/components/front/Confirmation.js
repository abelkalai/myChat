import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "FrontStylesheets/confirmation.css";

const Confirmation = (props) => {
  useEffect(() => {
    document.title = "Confirm | Mychat";
  },[]);
  return (
    <div className="confirmation-container">
      <h2> {props.confirmMsg}</h2>
      <Link to="/" className="link">
        <button className="general-button" type="button">
          Back to Login
        </button>
      </Link>
    </div>
  );
};

export default Confirmation;
