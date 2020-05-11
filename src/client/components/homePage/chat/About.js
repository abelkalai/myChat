import React, { useEffect } from "react";
import AboutPlaceholder from "./placeholders/AboutPlaceholder";
import "HomePageStylesheets/chat/about.css";

const About = (props) => {
  useEffect(() => {
    props.setFromAbout(true);
  }, []);
  
  if (!props.getUser.data.getUser) {
    return <AboutPlaceholder />;
  }

  return (
    <div id="about">
      {props.windowWidth <= 768 ? (
        <img
          id="mobile-nav-about-back-img"
          onClick={() => {
            props.setMobileDisplay("chatWindow");
          }}
          src="images/back.png"
        />
      ) : null}
      <img
        id="about-contact-img"
        alt={props.getUser.data.getUser.fullName}
        title={props.getUser.data.getUser.fullName}
        src={`data:image/png;base64,${props.getUser.data.getUser.profilePicture}`}
      />

      <div id="about-contact-name">
        {props.getUser.data.getUser.fullName}
      </div>

      <h3>About </h3>

      <div id="about-content">
        {props.getUser.data.getUser.about}
      </div>
    </div>
  );
};

export default About;
