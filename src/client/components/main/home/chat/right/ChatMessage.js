import React, { useState, Fragment } from "react";
import adjustTime from "Utilities/adjustTime";
import MobileNav from "./mobileNav/MobileNav";
import "MainStylesheets/chat/chatMessage.css";

const ChatMessage = (props) => {
  const [showLoading, setShowLoading] = useState(true);
  setTimeout(() => {
    setShowLoading(false);
  }, 100);

  return (
    <div className="chat-display-chat-container">
      {props.windowWidth <= 768 ? (
        <MobileNav
          setMobileDisplay={props.setMobileDisplay}
          getMessages={props.getMessages}
          getUser={props.getUser}
        />
      ) : null}
      {props.getMessages.loading || props.getUser.loading || showLoading ? (
        <div className="chat-display-chat-loading-wrapper">
          <img className="loading" src="gifs/loading.gif" />
        </div>
      ) : (
        <div id="messageContainer" className="chat-display-chat">
          {props.getMessages.data.getMessages.map((message) => (
            <div key={message._id} className="chat-message-wrapper">
              {message.senderID === props.userInfo._id ? (
                <span
                  title={adjustTime(message.time, true)}
                  className="chat-my-message"
                >
                  {message.content}
                </span>
              ) : (
                <span
                  title={adjustTime(message.time, true)}
                  className="chat-contact-message"
                >
                  {message.content}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
