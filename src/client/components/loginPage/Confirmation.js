import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "LoginPageStylesheets/confirmation.css";

const Confirmation = (props) => {
  useEffect(() => {
    document.title = "Confirm | Mychat";
  }, []);

  return (
    <div id="confirmation">
      <h2> {props.confirmMsg}</h2>
      <Link to="/">
        <button className="general-button" type="button">
          Back to Login
        </button>
      </Link>
    </div>
  );
};

export default Confirmation;
