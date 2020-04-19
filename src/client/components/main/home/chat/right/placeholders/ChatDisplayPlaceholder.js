import React from "react";
import MessagePlaceholder from "./MessagePlaceholder";
import AboutPlaceholder from "./AboutPlaceholder";

const ChatDisplayPlaceholder = () => {
  return (
    <div className="chat-display-parent">
      <div className="chat-display-chat-parent">
        <MessagePlaceholder />
      </div>
      <AboutPlaceholder />
    </div>
  );
};

export default ChatDisplayPlaceholder;
