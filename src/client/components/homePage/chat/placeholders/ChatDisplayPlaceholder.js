import React, { Fragment } from "react";
import MessagesPlaceholder from "./MessagesPlaceholder";
import AboutPlaceholder from "./AboutPlaceholder";
import DefaultChat from "./DefaultChat";

const ChatDisplayPlaceholder = (props) => {
  if (props.getConvosQuery.loading) {
    return (
      <Fragment>
        <MessagesPlaceholder />
        <AboutPlaceholder />
      </Fragment>
    );
  }
  return props.getConvosQuery.data.getConversations.length === 0 ? (
    <DefaultChat />
  ) : (
    <Fragment>
      <MessagesPlaceholder />
      <AboutPlaceholder />
    </Fragment>
  );
};

export default ChatDisplayPlaceholder;
