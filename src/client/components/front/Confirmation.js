import React from "react"
import {Link} from "react-router-dom"

const Confirmation = props => {
  return (
    <div className = "center">
      <h1> {props.confirmMsg}</h1>
      <Link to = "/" className = "link">
        <button type = "button"> Back to Login </button>
      </Link>
    </div>
  );
};

export default Confirmation;
