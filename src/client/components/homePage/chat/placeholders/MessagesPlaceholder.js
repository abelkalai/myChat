import React from "react";
import "HomePageStylesheets/chat/messages.css";

const MessagesPlaceholder = () => {
  const arr = [];

  for (let i = 0; i < 20; i++) {
    arr.push(
      <div key={`msgPlaceholder_${i}`} className="message-wrapper">
        {i % 2 === 0 ? (
          <img
            className="my-msg-placeholder"
            src="images/contentPlaceholder.png"
          />
        ) : (
          <img
            className="contact-msg-placeholder"
            src="images/contentPlaceholder.png"
          />
        )}
      </div>
    );
  }

  return (
    <div id="chat-window">
      <div id="messages-container">
        <div id="messages">{arr.map((element) => element)}</div>
      </div>
      <div id="message-form">
        <img
          id="msg-field-placeholder"
          src="images/contentPlaceholder.png"
        />
      </div>
    </div>
  );
};

export default MessagesPlaceholder;
