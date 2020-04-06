import React from "react";

const ChatMessage = (props) => {
  return (
    <div className="chat-display-chat">
      {props.messageData.map((message) =>
        message.senderID === props.userInfo._id ? (
          <div key={message._id} className="chat-message-wrapper">
            <span key={message._id} className="chat-my-message">
              {message.content}
            </span>
          </div>
        ) : (
          <div key={message._id} className="chat-message-wrapper">
            <span key={message._id} className="chat-contact-message">
              {message.content}
            </span>
          </div>
        )
      )}
    </div>
  );
};

export default ChatMessage;
