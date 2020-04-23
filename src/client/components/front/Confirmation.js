import React, {Fragment} from "react"
import {Link} from "react-router-dom"
import "../../assets/stylesheets/components/front/confirmation.css";

const Confirmation = props => {
  document.title = "Confirm | Mychat"
  return (
    <Fragment>
      <h3> {props.confirmMsg}</h3>
      <Link to = "/" className = "link">
        <button className="confirmation-back-to-login" type = "button"> Back to Login </button>
      </Link>
    </Fragment>
  );
};

export default Confirmation;
