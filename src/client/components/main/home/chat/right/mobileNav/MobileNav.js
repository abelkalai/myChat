import React, { useState } from "react";
import "MainStylesheets/chat/MobileNav.css";

const MobileNav = (props) => {
  const [showLoading, setShowLoading] = useState(true);
  setTimeout(() => {
    setShowLoading(false);
  }, 100);
  return (
    <div className="mobile-nav-header">
      <img
        className="mobile-nav-back-img"
        onClick={() => {
          props.setMobileDisplay("search");
        }}
        src="images/back.png"
      />
      <img
        className="mobile-nav-user-img"
        alt={props.getUser.data.getUser.fullName}
        title={props.getUser.data.getUser.fullName}
        src={
          props.getUser.loading || showLoading
            ? "images/profilePlaceholder.png"
            : `data:image/png;base64,${props.getUser.data.getUser.profilePicture}`
        }
      />
      <div className="mobile-nav-user-name-wrapper">
        {props.getUser.loading || showLoading ? (
          <img
            className="mobile-nav-user-placeholder-img"
            src="images/contentPlaceholder.png"
          />
        ) : (
          <div className="mobile-nav-user-name">
            {props.getUser.data.getUser.fullName}
          </div>
        )}
      </div>
      <img
        className="mobile-nav-info-img"
        onClick={() => {
          props.setMobileDisplay("about");
        }}
        src="images/info.png"
      />
    </div>
  );
};

export default MobileNav;
