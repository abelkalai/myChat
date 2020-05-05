import React from "react";
import AboutPlaceholder from "./placeholders/AboutPlaceholder";
import "MainStylesheets/chat/chatAbout.css";

const About = (props) => {
  if (!props.getUser.data.getUser) {
    return <AboutPlaceholder />;
  }
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

      <h1>{props.getUser.data.getUser.fullName}</h1>

      <h3>About </h3>

      <div className="chat-display-about-content">
        {props.getUser.data.getUser.about}
      </div>
    </div>
  );
};

export default About;
