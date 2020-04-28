import React, { Fragment } from "react";

const MessagePlaceholder = () => {
  const arr = [];

  for (let i = 0; i < 10; i++) {
    arr.push(
      <div key={`Msg${i}`} className="chat-message-wrapper">
        {i % 2 === 0 ? (
          <img
            className="msg-placeholder-img-me"
            src="images/contentPlaceholder.png"
          />
        ) : (
          <img
            className="msg-placeholder-img-contact"
            src="images/contentPlaceholder.png"
          />
        )}
      </div>
    );
  }
  
  return (
    <Fragment>
      <div className="chat-display-chat-container">
        <div className="chat-display-chat-parent">
          <div className="chat-display-chat">
            {arr.map((element) => element)}
          </div>
        </div>
      </div>
      <div className="chat-display-chat-send-message-form">
          <img className="msg-placeholder-msg-field" src="../../../../assets/images/contentPlaceholder.png"/>
      </div>
      </Fragment>
  );
};

export default MessagePlaceholder;
