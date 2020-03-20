import React, { useState, useEffect } from "react";

const General = props => {
  const nameSection = () => {
    return (
      <div>
        Name: {`${props.userInfo.firstName} ${props.userInfo.lastName}`}
      </div>
    );
  };
  
  const usernameSection = () => {
    return <div>Username: {`${props.userInfo.username}`}</div>;
  };

  return (
    <div className="main-right">
      <h1>General Settings</h1>
      {nameSection()}
      {usernameSection()}
      <div>Email: {`${props.userInfo.email}`}</div>
    </div>
  );
};

export default General;
