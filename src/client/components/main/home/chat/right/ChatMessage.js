import React from "react";
import MessagePlaceholder from "./placeholders/MessagePlaceholder";
import adjustTime from "Utilities/adjustTime"
import "MainStylesheets/chatMessage.css";

const ChatMessage = (props) => {
  if (!props.getMessages.data.getMessages) {
    return <MessagePlaceholder />;
  }
  return (
    <div className="chat-display-chat-container">
      <div id="messageContainer" className="chat-display-chat">
        {props.getMessages.data.getMessages.map((message) =>
          message.senderID === props.userInfo._id ? (
            <div key={message._id} className="chat-message-wrapper">
              <span
                title={adjustTime(message.time, true)}
                key={message._id}
                className="chat-my-message"
              >
                {message.content}
              </span>
            </div>
          ) : (
            <div key={message._id} className="chat-message-wrapper">
              <span
                title={adjustTime(message.time, true)}
                key={message._id}
                className="chat-contact-message"
              >
                {message.content}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
