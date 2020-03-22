import React from "react";
import {Link} from "react-router-dom"

const InvalidLink = props => {
  document.title = "Page Not Found | MyChat";
  return (
    <div className="center">
      <h1>Whoops! This page isn't avaliable on MyChat</h1>
      <p>
        The link you followed may be broken. Please try again or use the button
        below to login.
      </p>
      <Link to="/">
        <button
          type="button"
          onClick={() => {
            setValid(true);
          }}
        >
          {`Back to ${props.type}`}
        </button>
      </Link>
    </div>
  );
};

export default InvalidLink;
