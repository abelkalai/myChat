import React from "react";

const ChatDisplayPlaceholder = () => {
  const MessagePlaceholder = () => {
    const arr = [];
    for (let i = 0; i < 14; i++) {
      arr.push(
        <div key={`Msg${i}`} className="chat-message-wrapper">
          {i % 2 === 0 ? (
            <img
              className="msg-placeholder-img-me"
              src="../../../../assets/images/contentPlaceholder.png"
            />
          ) : (
            <img
              className="msg-placeholder-img-contact"
              src="../../../../assets/images/contentPlaceholder.png"
            />
          )}
        </div>
      );
    }
    return (
      <div className="chat-display-chat-parent">
        <div className="chat-display-chat">{arr.map((element) => element)}</div>
        <div className="chat-display-chat-send-message-form">
          <input
            type="text"
            className="chat-display-chat-message-field"
            placeholder="Type a message..."
          />
          <input type="image" src="../../../../assets/images/send.png" />
        </div>
      </div>
    );
  };

  const AboutPlaceholder = () => {
    return (
      <div className="chat-display-about">
        <img
          className="chat-about-name-placeholder"
          src="../../../../assets/images/contentPlaceholder.png"
        />

        <img
          className="chat-display-about-img"
          src="../../../../assets/images/profilePlaceholder.png"
        />

        <h2>About </h2>

        <img
          className="chat-about-content-placeholder"
          src="../../../../assets/images/contentPlaceholder.png"
        />
      </div>
    );
  };
  return (
    <div className="chat-display-parent">
      {MessagePlaceholder()}
      {AboutPlaceholder()}
    </div>
  );
};

export default ChatDisplayPlaceholder;
