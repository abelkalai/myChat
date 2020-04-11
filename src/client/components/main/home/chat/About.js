import React from "react";

const About = (props) => {
  return (
    <div className="chat-display-about">
      <h1>{props.getUser.data.getSingleUser.fullName}</h1>

      <img
        className="chat-display-about-img"
        src={`data:image/png;base64,${props.getUser.data.getSingleUser.profilePicture}`}
      />

      <h2>About </h2>

      <div className="chat-display-about-content">
        {props.getUser.data.getSingleUser.about}
      </div>
    </div>
  );
};

export default About;
