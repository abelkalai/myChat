import React, { useState, useEffect } from "react";
import "HomePageStylesheets/chat/MobileNav.css";

const MobileNav = (props) => {
  const [showLoading, setShowLoading] = useState(props.fromAbout ? false : true);
  useEffect(() => {
    props.setFromAbout(false);
  }, []);
  setTimeout(() => {
    setShowLoading(false);
  }, 100);
  return (
    <div id="mobile-nav">
      <img
        id="mobile-nav-back-img"
        onClick={() => {
          props.setMobileDisplay("search");
        }}
        src="images/back.png"
      />
      <img
        id="mobile-nav-user-img"
        alt={props.getUser.data.getUser.fullName}
        title={props.getUser.data.getUser.fullName}
        src={
          props.getUser.loading || showLoading
            ? "images/profilePlaceholder.png"
            : `data:image/png;base64,${props.getUser.data.getUser.profilePicture}`
        }
      />
      <div id="mobile-nav-name-wrapper">
        {props.getUser.loading || showLoading ? (
          <img
            id="mobile-nav-user-placeholder-img"
            src="images/contentPlaceholder.png"
          />
        ) : (
          <div id="mobile-nav-user-name">
            {props.getUser.data.getUser.fullName}
          </div>
        )}
      </div>
      <img
        id="mobile-nav-info-img"
        onClick={() => {
          props.setMobileDisplay("about");
        }}
        src="images/info.png"
      />
    </div>
  );
};

export default MobileNav;
