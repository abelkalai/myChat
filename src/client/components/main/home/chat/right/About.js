import React, { useEffect } from "react";
import AboutPlaceholder from "./placeholders/AboutPlaceholder";
import "MainStylesheets/chat/chatAbout.css";

const About = (props) => {
  if (!props.getUser.data.getUser) {
    return <AboutPlaceholder />;
  }
  useEffect(() => {
    props.setFromAbout(true);
  }, []);
  return (
    <div className="chat-display-about">
      {props.windowWidth <= 768 ? (
        <img
          className="mobile-nav-about-img"
          onClick={() => {
            props.setMobileDisplay("messages");
          }}
          src="images/back.png"
        />
      ) : null}
      <img
        className="chat-display-about-img"
        alt={props.getUser.data.getUser.fullName}
        title={props.getUser.data.getUser.fullName}
        src={`data:image/png;base64,${props.getUser.data.getUser.profilePicture}`}
      />

      <div className="chat-display-about-name-header">
        {props.getUser.data.getUser.fullName}
      </div>

      <h3>About </h3>

      <div className="chat-display-about-content">
        {props.getUser.data.getUser.about}
      </div>
    </div>
  );
};

export default About;
