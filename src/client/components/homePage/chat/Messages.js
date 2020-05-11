import React, { useState } from "react";
import adjustTime from "Utilities/adjustTime";
import MobileNav from "./MobileNav";
import "HomePageStylesheets/chat/messages.css";

const ChatMessage = (props) => {
  const [showLoading, setShowLoading] = useState(true);
  setTimeout(() => {
    setShowLoading(false);
  }, 100);

  if (!props.getUser.data.getUser) {
    return (
      <div id="messages-container">
        <div id="messages-loading">
          <img className="loading" src="gifs/loading.gif" />
        </div>
      </div>
    );
  }

  return (
    <div id="messages-container">
      {props.windowWidth <= 768 ? (
        <MobileNav
          setMobileDisplay={props.setMobileDisplay}
          getMessages={props.getMessages}
          getUser={props.getUser}
          fromAbout={props.fromAbout}
          setFromAbout={props.setFromAbout}
        />
      ) : null}
      {props.getMessages.loading || props.getUser.loading || showLoading ? (
        <div id="messages-loading">
          <img className="loading" src="gifs/loading.gif" />
        </div>
      ) : (
        <div id="messages">
          {props.getMessages.data.getMessages.map((message) => (
            <div key={message._id} className="message-wrapper">
              {message.senderID === props.userInfo._id ? (
                <span
                  title={adjustTime(message.time, true)}
                  className="my-message"
                >
                  {message.content}
                </span>
              ) : (
                <span
                  title={adjustTime(message.time, true)}
                  className="contact-message"
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
