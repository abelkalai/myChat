import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/stylesheets/components/front/frontPage.css";
const InvalidLink = (props) => {
  useEffect(() => {
    document.title = "Page Not Found | MyChat";
  },[]);
  return (
    <div className="center">
      <h1>Whoops! This page isn't avaliable.</h1>
      <p>
        The link you followed may be broken. Please try again or follow the
        button below.
      </p>
      <Link to={props.type === "Login" ? "/" : "/home"}>
        <button className="general-button" type="button">
          {`Back to ${props.type}`}
        </button>
      </Link>
    </div>
  );
};

export default InvalidLink;
