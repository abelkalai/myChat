import React, { Fragment } from "react";
import MessagePlaceholder from "./MessagePlaceholder";
import AboutPlaceholder from "./AboutPlaceholder";
import DefaultChat from "./DefaultChat";
const ChatDisplayPlaceholder = (props) => {
  if (props.convoHistory.loading) {
    return (
      <Fragment>
        <div className="chat-display-chat-parent">
          <MessagePlaceholder />
        </div>
        <AboutPlaceholder />
      </Fragment>
    );
  }
  return props.convoHistory.data.getConversations.length === 0 ? (
    <DefaultChat />
  ) : (
    <Fragment>
      <div className="chat-display-chat-parent">
        <MessagePlaceholder />
      </div>
      <AboutPlaceholder />
    </Fragment>
  );
};

export default ChatDisplayPlaceholder;
