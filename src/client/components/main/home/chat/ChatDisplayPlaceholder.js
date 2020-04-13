import React from "react";
import MessagePlaceholder from "./MessagePlaceholder";
import AboutPlaceholder from "./AboutPlaceholder";

const ChatDisplayPlaceholder = () => {
  return (
    <div className="chat-display-parent">
      <MessagePlaceholder />
      <AboutPlaceholder />
    </div>
  );
};

export default ChatDisplayPlaceholder;
