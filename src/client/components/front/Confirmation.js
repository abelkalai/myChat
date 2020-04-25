import React  from "react"
import {Link} from "react-router-dom"
import "../../assets/stylesheets/components/front/confirmation.css";

const Confirmation = props => {
  document.title = "Confirm | Mychat"
  return (
    <div className="confirmation-container">
      <h2> {props.confirmMsg}</h2>
      <Link to = "/" className = "link">
        <button className="confirmation-back-to-login" type = "button"> Back to Login </button>
      </Link>
    </div>
  );
};

export default Confirmation;
