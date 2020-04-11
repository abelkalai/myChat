import React, {Fragment} from "react"
import {Link} from "react-router-dom"

const Confirmation = props => {
  document.title = "Confirm | Mychat"
  return (
    <Fragment>
      <h1> {props.confirmMsg}</h1>
      <Link to = "/" className = "link">
        <button type = "button"> Back to Login </button>
      </Link>
    </Fragment>
  );
};

export default Confirmation;
