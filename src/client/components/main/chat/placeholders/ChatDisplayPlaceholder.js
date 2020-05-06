import React, { Fragment } from "react";
import MessagePlaceholder from "./MessagePlaceholder";
import AboutPlaceholder from "./AboutPlaceholder";
import DefaultChat from "./DefaultChat";
const ChatDisplayPlaceholder = (props) => {
  if (props.convoHistory.loading) {
    return props.windowWidth > 950 ? (
      <Fragment>
        <div className="chat-display-chat-parent">
          <MessagePlaceholder />
        </div>
        <AboutPlaceholder />
      </Fragment>
    ) : null;
  }
  return props.convoHistory.data.getConversations.length === 0 ? (
    <DefaultChat />
  ) : props.windowWidth > 950 ? (
    <Fragment>
      <div className="chat-display-chat-parent">
        <MessagePlaceholder />
      </div>
      <AboutPlaceholder />
    </Fragment>
  ) : null;
};

export default ChatDisplayPlaceholder;
